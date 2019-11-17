const httpStatus = require('http-status');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const ResponseError = require('../common/ResponseError');

module.exports = function(passport, config, db) {
  // http://www.passportjs.org/packages/passport-google-oauth20/
  const User = db.User;
  const googleConfig = config.get('passport.google');
  passport.use(new GoogleStrategy(googleConfig,
    function(accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  ));

  // http://www.passportjs.org/packages/passport-facebook/
  const facebookConfig = config.get('passport.facebook');
  passport.use(new FacebookStrategy(facebookConfig,
    function(accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ facebookId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  ));

  // http://www.passportjs.org/packages/passport-instagram/
  const instagramConfig = config.get('passport.instagram');
  passport.use(new InstagramStrategy(instagramConfig,
    function(accessToken, refreshToken, profile, done) {
      User.findOrCreate({ instagramId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  ));

  // http://www.passportjs.org/packages/passport-jwt/
  const jwtConfig = config.get('passport.jwt');
  passport.use(new JwtStrategy({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: jwtConfig.secret },
    function(jwtPayload, done) {
      User.findOne({ where: { id: jwtPayload.id } }, function(err, user) {
        if (err) {
          return done(err, false);
        } else if (user) {
          return done(null, user);
        } else {
          return done(new responseError('User not found', httpStatus.UNAUTHORIZED), null);
        }
      });
    }
  ));
};
