const LocalStrategy = require("passport-local");
const User = require("../models/user");
const { matchHashedPassword } = require("../utils/hasher");

module.exports = (passport) => {
  // Setting up passport local strategy
  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      async (username, password, done) => {
        try {
          const user = await User.findOne({ username: username });

          if (!user)
            return done(null, false, { message: "Incorrect username." });

          // console.log("User found:", user);

          if (!user.password) {
            return done(null, false, {
              message: "User password is undefined.",
            });
          }

          const isValid = matchHashedPassword(password, user.password);
          if (isValid) return done(null, user);
          else return done(null, false, { message: "Incorrect password." });
        } catch (err) {
          console.error(err);
          return done(err);
        }
      }
    )
  );

  // Serializing user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserializing user
  passport.deserializeUser(async (user_id, done) => {
    try {
      const user = await User.findById(user_id);
      done(null, user);
    } catch (e) {
      done(err, false);
    }
  });
};
