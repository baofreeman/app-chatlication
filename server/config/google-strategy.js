const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const bcrypt = require("bcrypt");

const Users = require("../models/auth/User");
const { generateToken } = require("../utils/token");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      try {
        // Check if user already exists in the database
        let user = await Users.findOne({ email: profile._json.email });
        if (!user) {
          const lastSixDigitsID = profile.id.substring(profile.id.length - 6);
          const lastTwoDigitsName = profile._json.name.substring(
            profile._json.name.length - 2
          );
          const newPass = lastTwoDigitsName + lastSixDigitsID;

          // Generate salt and hash password
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(newPass, salt);

          user = await Users.create({
            username: profile._json.name,
            email: profile._json.email,
            is_verified: true,
            password: hashPassword,
          });
        }
        // Generate JWT token
        const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
          await generateToken(user);
        return done(null, {
          user,
          accessToken,
          refreshToken,
          accessTokenExp,
          refreshTokenExp,
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);
