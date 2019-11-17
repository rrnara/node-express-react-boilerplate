const hashing = require('../common/hashing');
const jwt = require('jsonwebtoken');
const pick = require('lodash/pick');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    isSuperAdmin: DataTypes.BOOLEAN,
    email: {
      type: DataTypes.STRING,
      validate: {
         isEmail: true
      }
    },
    password: DataTypes.STRING,
    passwordResetToken: DataTypes.STRING,
    passwordResetExpires: DataTypes.DATE,
    emailVerificationToken: DataTypes.STRING,
    emailVerificationExpires: DataTypes.DATE,
    emailVerified: DataTypes.BOOLEAN,
    facebookId: DataTypes.STRING,
    instagramId: DataTypes.STRING,
    googleId: DataTypes.STRING,
    isDeleted: DataTypes.BOOLEAN
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  User.setConfig = function(config) {
    User.jwtSettings = config.get('passport.jwt');
  };
  User.addHook('beforeCreate', (user) => {
    if (user.password) {
      user.password = hashing.hashSync(user.password);
    }
  });
  User.addHook('beforeUpdate', (user) => {
    if (user.password != user.previous.password) {
      user.password = hashing.hashSync(user.password);
    }
  });
  User.prototype.isValidPassword = function(plainText) {
    return hashing.compareSync(plainText, this.password);
  };
  User.prototype.generateJWTToken = function() {
    return jwt.sign({ id: this.id }, User.jwtSettings.secret, { expiresIn: User.jwtSettings.expiresIn });
  };
  User.prototype.response = function() {
    return pick(this, ['id', 'email', 'emailVerified']);
  }
  return User;
};
