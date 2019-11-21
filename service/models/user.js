const hashing = require('../common/hashing');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const pick = require('lodash/pick');
const isEmpty = require('lodash/isEmpty');
const globalCache = require('global-cache');

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
    const config = globalCache.get('config');
    const jwtSettings = config.get('passport.jwt');
    return jwt.sign({ id: this.id }, jwtSettings.secret, { expiresIn: jwtSettings.expiresIn });
  };
  User.generateToken = function(isEmail) {
    const token = crypto.randomBytes(56).toString('hex');
    const expires = new Date();
    expires.setDate(expires.getDate() + 2);
    return isEmail ? { emailVerificationToken: token, emailVerificationExpires: expires }
                   : { passwordResetToken: token, passwordResetExpires: expires };
  };
  User.prototype.isTokenExpired = function(isEmail) {
    const expiry = isEmail ? this.emailVerificationExpires : this.passwordResetExpires;
    return expiry < new Date();
  };
  User.prototype.isValidToken = function(token, isEmail) {
    const dbToken = isEmail ? this.emailVerificationToken : this.passwordResetToken;
    return crypto.timingSafeEqual(new Buffer(dbToken), new Buffer(token));
  },
  User.prototype.response = function() {
    return Object.assign({
      passwordSet: !isEmpty(this.password),
    }, pick(this, ['id', 'email', 'emailVerified', 'isSuperAdmin']));
  };
  return User;
};
