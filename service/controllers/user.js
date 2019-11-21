const { Router } = require('express');
const passport = require('passport');
const joiValidator = require('express-joi-validation').createValidator({});
const passwordJoi = require('../common/passwordJoi');
const httpStatus = require('http-status');
const globalCache = require('global-cache');
const { threeParamAsyncMiddleware } = require('../common/asyncMiddleware');
const ResponseError = require('../common/ResponseError');

module.exports = function() {
  const database = globalCache.get('database');
  const mailer = globalCache.get('mailer');
  const router = new Router();

  router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send({ user: req.user.response() });
  });

  const createBody = passwordJoi.object({
    email: passwordJoi.string().email().required()
  });
  router.post('/', joiValidator.body(createBody), passport.authenticate('jwt', { session: false }), threeParamAsyncMiddleware(async (req, res, next) => {
    if (!req.user.isSuperAdmin) {
      throw new ResponseError('Only admin can create accounts', httpStatus.UNAUTHORIZED);
    }

    const existingUser = await database.User.findOne({ where: { email: req.body.email } });
    if (existingUser) {
      throw new ResponseError('Account already exists', httpStatus.CONFLICT);
    }

    const createParams = Object.assign({ email: req.body.email }, database.User.generateToken(true));
    const newUser = await database.User.create(createParams);

    await mailer.sendTokenEmail(createParams.email, 'verifyEmail', createParams.emailVerificationToken);

    // Send confirmation email
    res.send({ user: newUser.response() });
  }));

  return router;
};
