const lodash = require('lodash');
const FacebookTokenStrategy = require('passport-facebook-token');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const globalCache = require('global-cache');
const { twoParamAsyncMiddleware, fourParamAsyncMiddleware } = require('../common/asyncMiddleware');
const { BOOLIFY } = require('../common/utils');

module.exports = function(passport) {
  const database = globalCache.get('database');
  const config = globalCache.get('config');
  const Op = database.Sequelize.Op;

  const facebookConfig = Object.assign({}, config.get('passport.facebook'));
  // facebookConfig.profileFields = ['id', 'displayName', 'email'];
  facebookConfig.fbGraphVersion = 'v5.0';
  passport.use(new FacebookTokenStrategy(facebookConfig,
    fourParamAsyncMiddleware(async (accessToken, refreshToken, profile, done) => {
      let facebookUser;
      const user = { facebookId: profile.id, email: profile.emails[0].value, name: profile.displayName, emailVerified: true };
      const users = await database.User.findAll({ where: { [Op.or]: [ { facebookId: user.facebookId }, { email: user.email } ] } });
      if (users.length > 2) {
        // Unique index should prevent this state
        throw new Error('Unexpected DB condition');
      } else if (users.length == 0) {
        facebookUser = await database.User.create(user);
      } else if (users.length == 1) {
        // We have one and not the other, need to update
        facebookUser = users[0];
        if (!lodash.isEqual(user, lodash.pick(facebookUser, Object.keys(user)))) {
          await facebookUser.update(user);
        }
      } else {
        if (users[0].facebookId === user.facebookId) {
          facebookUser = users[0];
          facebookUser.duplicateId = users[1].id;
        } else {
          facebookUser = users[1];
          facebookUser.duplicateId = users[0].id;
        }
      }
      return done(null, facebookUser);
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
