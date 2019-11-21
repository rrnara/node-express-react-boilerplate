const passwordValidator = require('password-validator');

const validator = new passwordValidator()
  .is().min(8)                                    // Minimum length 8
  .is().max(32)                                   // Maximum length 32
  .has().uppercase()                              // Must have uppercase letters
  .has().lowercase()                              // Must have lowercase letters
  .has().digits()                                 // Must have digits
  .has().symbols()                                // Must have symbols
  .has().not().spaces()                           // Should not have spaces
;

const errors = {
  match: "Passwords do not match",
  min: "Password needs to be atleast 8 characters",
  max: "Password can atmost 32 characters",
  uppercase: "Password needs atleast 1 uppercase character",
  lowercase: "Password needs atleast 1 lowercase character",
  digits: "Password needs atleast 1 number",
  symbols: "Password needs atleast 1 special character",
  spaces: "Password cannot have spaces"
};

module.exports = { validator, errors };
