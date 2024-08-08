const express = require("express");
const app = express();
const cors = require("cors");
const passport = require("passport");
const authRouter = require("./routers/auth");
require("./config/passport-jwt-strategy.js");
const cookieParser = require("cookie-parser");
const { setTokenCookies } = require("./utils/setTokenCookies.js");
require("./config/google-strategy.js");

const corsOptions = {
  origin: process.env.FRONTEND_HOST,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());

app.use("/api/auth", authRouter);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_HOST}/account/login`,
  }),
  (req, res) => {
    // Access user object and token from req.user
    const { user, accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
      req.user;
    setTokenCookies(
      res,
      accessToken,
      refreshToken,
      accessTokenExp,
      refreshTokenExp
    );
    res.redirect(`${process.env.FRONTEND_HOST}/user/profile`);
  }
);

module.exports = app;
