const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
  hashSync: (plainText) => {
    return bcrypt.hashSync(plainText, saltRounds);
  },
  compareSync: (plainText, hash) => {
    return bcrypt.compareSync(plainText, hash);
  }
};
