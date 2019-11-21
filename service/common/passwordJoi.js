const lodash = require('lodash');
const Joi = require('@hapi/joi');
const pv = require('../../client/utils/passwordValidator');

module.exports = Joi.extend(joi => ({
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
