const passport = require('passport');
const passportJWT = require('passport-jwt');

const { Users } = require('../../models');

passport.use(
  'user',
  new passportJWT.Strategy(
    {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
      secretOrKey: 'RANDOM_STRING',
    },
    async (payload, done) => {
      const user = await Users.findOne({ email: payload.email });

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    }
  )
);

module.exports = passport.authenticate('user', { session: false });
