const lodash = require('lodash');
const { Router } = require('express');
const Joi = require('@hapi/joi');
const joiValidator = require('express-joi-validation').createValidator({});
const asyncMiddleware = require('../common/asyncMiddleware');
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

module.exports = function (db, config) {
  const router = Router();

  const loginBody = passwordJoi.object({
    email: passwordJoi.string().email().required(),
    password: passwordJoi.string().required()
  });
  router.post('/login', joiValidator.body(loginBody), asyncMiddleware(async (req, res, next) => {
    const user = await db.User.findOne({ where: { email: req.body.email } });
    res.send({ user: user.response(), token: user.generateJWTToken() });
  }));

  return router;
};
