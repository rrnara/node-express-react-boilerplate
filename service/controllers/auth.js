const lodash = require('lodash');
const { Router } = require('express');
const passport = require('passport');
const Joi = require('@hapi/joi');
const joiValidator = require('express-joi-validation').createValidator({});
const httpStatus = require('http-status');
const globalCache = require('global-cache');
const ResponseError = require('../common/ResponseError');
const { threeParamAsyncMiddleware } = require('../common/asyncMiddleware');
const pv = require('../../client/utils/passwordValidator');

const passwordJoi = Joi.extend(joi => ({
  type: 'password',
  base: joi.string(),
  messages: pv.errors,
  validate(value, helpers) {
    const validationErrors = pv.validator.validate(value, { list: true });
    if (!lodash.isEmpty(validationErrors)) {
      return {
        value,
        errors: validationErrors.map(err => helpers.error(err))
      };
    }
  }
}));

module.exports = function() {
  const database = globalCache.get('database');
  const router = Router();

  const loginBody = passwordJoi.object({
    email: passwordJoi.string().email().required(),
    password: passwordJoi.string().required()
  });
  router.post('/login', joiValidator.body(loginBody), threeParamAsyncMiddleware(async (req, res, next) => {
    const user = await database.User.findOne({ where: { email: req.body.email } });
    if (!user) {
      throw new ResponseError('User not found', httpStatus.NOT_FOUND);
    } else if (!user.isValidPassword(req.body.password)) {
      throw new ResponseError('Invalid password', httpStatus.UNAUTHORIZED);
    } else if (!user.emailVerified) {
      throw new ResponseError('Confirm your email to continue', httpStatus.UNAUTHORIZED);
    }
    res.send({ user: user.response(), token: user.generateJWTToken() });
  }));

  const facebookBody = passwordJoi.object({
    access_token: passwordJoi.string().required()
  });
  router.post('/facebook', joiValidator.body(facebookBody), passport.authenticate('facebook-token', { session: false }), (req, res, next) => {
    if (!req.user) {
      throw new ResponseError('User not found', httpStatus.NOT_FOUND);
    }
    res.send({ user: req.user.response(), token: req.user.generateJWTToken() });
  });

  return router;
};
