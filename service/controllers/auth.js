const { Router } = require('express');
const passport = require('passport');
const joiValidator = require('express-joi-validation').createValidator({});
const httpStatus = require('http-status');
const globalCache = require('global-cache');
const passwordJoi = require('../common/passwordJoi');
const ResponseError = require('../common/ResponseError');
const { threeParamAsyncMiddleware } = require('../common/asyncMiddleware');
const { BOOLIFY } = require('../common/utils');

const findUser = async (database, body) => {
  const user = await database.User.findOne({ where: { email: body.email } });
  if (!user) {
    throw new ResponseError('User not found', httpStatus.NOT_FOUND);
  }
  return user;
};

const validatePassword = function(user, body) {
  const password = body.oldPassword || body.password;
  if (!user.isValidPassword(password)) {
    throw new ResponseError('Invalid password', httpStatus.UNAUTHORIZED);
  } else if (!user.emailVerified) {
    throw new ResponseError('Confirm your email to continue', httpStatus.UNAUTHORIZED);
  }
};

const validateTokens = function(user, body) {
  if (body.resetPassword) {
    if(user.isTokenExpired(false)) {
      throw new ResponseError('Token expired', httpStatus.GONE);
    } else if (!user.isValidToken(body.resetPassword, false)) {
      throw new ResponseError('Invalid token', httpStatus.FORBIDDEN);
    }
  } else {
    if (user.emailVerified) {
      throw new ResponseError('Email already verified', httpStatus.BAD_REQUEST);
    } else if(user.isTokenExpired(true)) {
      throw new ResponseError('Token expired', httpStatus.GONE);
    } else if (!user.isValidToken(req.confirmEmail, true)) {
      throw new ResponseError('Invalid token', httpStatus.FORBIDDEN);
    }
  }
};

module.exports = function() {
  const mailer = globalCache.get('mailer');
  const database = globalCache.get('database');
  const router = Router();

  const loginBody = passwordJoi.object({
    email: passwordJoi.string().email().required(),
    password: passwordJoi.string().required()
  });
  router.post('/login', joiValidator.body(loginBody), threeParamAsyncMiddleware(async (req, res, next) => {
    const user = await findUser(database, req.body);
    validatePassword(user, req.body);
    res.send({ user: user.response(), token: user.generateJWTToken() });
  }));

  const facebookBody = passwordJoi.object({
    access_token: passwordJoi.string().required()
  });
  router.post('/facebook', joiValidator.body(facebookBody), passport.authenticate('facebook-token', { session: false }), (req, res, next) => {
    if (!req.user) {
      throw new ResponseError('User not found', httpStatus.NOT_FOUND);
    }
    const user = Object.assign({ hasDuplicates: BOOLIFY(req.user.duplicateId) }, req.user.response());
    res.send({ user, token: req.user.generateJWTToken() });
  });

  const setPasswordBody = passwordJoi.object({
    email: passwordJoi.string().email().required(),
    password: passwordJoi.password().required(),
    oldPassword: passwordJoi.string(),
    resetPassword: passwordJoi.string(),
    confirmEmail: passwordJoi.string()
  });
  router.put('/password', joiValidator.body(setPasswordBody), threeParamAsyncMiddleware(async (req, res, next) => {
    if (!req.body.oldPassword && !req.body.resetPassword && !req.body.confirmEmail) {
      throw new ResponseError('Need oldPassword or resetPassword or confirmEmail', httpStatus.BAD_REQUEST);
    }
    const user = await findUser(database, req.body);
    if (req.body.oldPassword) {
      validatePassword(user, req.body);
    } else {
      validateTokens(user, req.body);
    }
    await user.update({ password: req.body.password, emailVerified: true });
    res.send({ user: user.response, token: user.generateJWTToken() });
  }));

  const validateBody = passwordJoi.object({
    email: passwordJoi.string().email().required(),
    resetPassword: passwordJoi.string(),
    confirmEmail: passwordJoi.string()
  });
  router.post('/validateToken', joiValidator.body(validateBody), threeParamAsyncMiddleware(async (req, res, next) => {
    if (!req.body.resetPassword && !req.body.confirmEmail) {
      throw new ResponseError('Need resetPassword or confirmEmail', httpStatus.BAD_REQUEST);
    }
    const user = await findUser(database, req.body);
    validateTokens(user, req.body);
    res.send({ email: user.email });
  }));

  const generateBody = passwordJoi.object({
    email: passwordJoi.string().email().required(),
    type: passwordJoi.string(),
    confirmEmail: passwordJoi.string()
  });
  router.put('/generateToken', joiValidator.body(generateBody), threeParamAsyncMiddleware(async (req, res, next) => {
    if (req.body.type !== 'resetPassword' && req.body.type !== 'confirmEmail') {
      throw new ResponseError('Need resetPassword or confirmEmail', httpStatus.BAD_REQUEST);
    }
    const isEmail = req.body.type === 'confirmEmail';
    const user = await findUser(database, req.body);
    const updateParams = database.User.generateToken(isEmail);
    await user.update(updateParams);
    const token = isEmail ? updateParams.emailVerificationToken : updateParams.passwordResetToken;
    const path = isEmail ? 'verifyEmail' : 'verifyReset';
    await mailer.sendTokenEmail(req.body.email, path, token);
    res.send({ email: user.email });
  }));

  return router;
};
