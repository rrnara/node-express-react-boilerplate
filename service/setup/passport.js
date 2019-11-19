const httpStatus = require('http-status');
const FacebookTokenStrategy = require('passport-facebook-token');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const globalCache = require('global-cache');
const { twoParamAsyncMiddleware, fourParamAsyncMiddleware } = require('../common/asyncMiddleware');
const ResponseError = require('../common/ResponseError');

module.exports = function(passport) {
  const database = globalCache.get('database');
  const config = globalCache.get('config');

  const facebookConfig = Object.assign({}, config.get('passport.facebook'));
  // facebookConfig.profileFields = ['id', 'displayName', 'email'];
  facebookConfig.fbGraphVersion = 'v5.0';
  passport.use(new FacebookTokenStrategy(facebookConfig,
    fourParamAsyncMiddleware(async (accessToken, refreshToken, profile, done) => {
      let user = await database.User.findOne({ where: { facebookId: profile.id } });
      if (!user) {
        user = await database.User.findOne({ where: { email: profile.emails[0].value } });
        if (!user) {
          const u = { facebookId: profile.id, email: profile.emails[0].value, name: profile.displayName, emailVerified: true };
          user = await database.User.create({ facebookId: profile.id, email: profile.emails[0].value, name: profile.displayName, emailVerified: true });
        }
      }
      return done(null, user);
    })
  ));

  // http://www.passportjs.org/packages/passport-jwt/
  const jwtConfig = config.get('passport.jwt');
  passport.use(new JwtStrategy({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: jwtConfig.secret },
  twoParamAsyncMiddleware(async (jwtPayload, done) => {
      const user = await database.User.findOne({ where: { id: jwtPayload.id } });
      return done(null, user);
    })
  ));
};
