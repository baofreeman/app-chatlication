const jwt = require("jsonwebtoken");
const UserModel = require("../models/auth/User");
const UserRefreshTokenModel = require("../models/auth/UserRefreshToken");

const generateToken = async (user) => {
  try {
    const payload = { _id: user._id, roles: user.roles };

    // Generate access token with expiration time
    const accessTokenExp = Math.floor(Date.now() / 1000) + 20; // Set expiration to 100 seconds from now
    const accessToken = jwt.sign(
      { ...payload, exp: accessTokenExp },
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY
      // { expiresIn: '10s' }
    );

    // Generate refresh token with expiration time
    const refreshTokenExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5; // Set expiration to 5 days from now
    const refreshToken = jwt.sign(
      { ...payload, exp: refreshTokenExp },
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY
      // { expiresIn: '5d' }
    );

    const userRefreshToken = await UserRefreshTokenModel.findOneAndDelete({
      userId: user._id,
    });

    //  // if want to blacklist rather than remove then use below code
    // if (userRefreshToken) {
    //   userRefreshToken.blacklisted = true;
    //   await userRefreshToken.save();
    // }

    // Save New Refresh Token
    await new UserRefreshTokenModel({
      userId: user._id,
      token: refreshToken,
    }).save();

    return Promise.resolve({
      accessToken,
      refreshToken,
      accessTokenExp,
      refreshTokenExp,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

const isTokenExpire = (token) => {
  if (!token) {
    return true;
  }
  const decodedToken = jwt.decode(token);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
};

const verifyRefreshToken = async (refreshToken) => {
  try {
    const privateKey = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;

    // Find the refresh token document
    const userRefreshToken = await UserRefreshTokenModel.findOne({
      token: refreshToken,
    });

    // If refresh token not found, reject with an error
    if (!userRefreshToken) {
      return { error: "failed", message: "Invalid Refresh Token" };
    }

    // Verify the refresh token
    const tokenDetails = jwt.verify(refreshToken, privateKey);

    // If verification successful, resolve with token details
    return {
      tokenDetails,
      error: false,
      message: "Valid refresh token",
    };
  } catch (error) {
    // If any error occurs during verification or token not found, reject with an error
    throw { error: true, message: "Invalid refresh token" };
  }
};

const setTokenCookies = (
  res,
  accessToken,
  refreshToken,
  newAccessTokenExp,
  newRefreshTokenExp
) => {
  const accessTokenMaxAge =
    (newAccessTokenExp - Math.floor(Date.now() / 1000)) * 1000;
  const refreshTokenmaxAge =
    (newRefreshTokenExp - Math.floor(Date.now() / 1000)) * 1000;

  // Set Cookie for Access Token
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true, // Set to true if using HTTPS
    maxAge: accessTokenMaxAge,
    // sameSite: 'strict', // Adjust according to your requirements
  });

  // Set Cookie for Refresh Token
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true, // Set to true if using HTTPS
    maxAge: refreshTokenmaxAge,
    // sameSite: 'strict', // Adjust according to your requirements
  });
  // Set Cookie for is_auth
  res.cookie("is_auth", true, {
    httpOnly: false,
    secure: false, // Set to true if using HTTPS
    maxAge: refreshTokenmaxAge,
    // sameSite: 'strict', // Adjust according to your requirements
  });
};

const refreshAccessToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    // Verify Refresh Token is valid or not
    const { tokenDetails, error } = await verifyRefreshToken(oldRefreshToken);

    if (error) {
      return res
        .status(401)
        .send({ status: "failed", message: "Invalid refresh token" });
    }
    // Find User based on Refresh Token detail id
    const user = await UserModel.findById(tokenDetails._id);

    if (!user) {
      return res
        .status(404)
        .send({ status: "failed", message: "User not found" });
    }

    const userRefreshToken = await UserRefreshTokenModel.findOne({
      userId: tokenDetails._id,
    });

    if (
      oldRefreshToken !== userRefreshToken.token ||
      userRefreshToken.blacklisted
    ) {
      return res
        .status(401)
        .send({ status: "failed", message: "Unauthorized access" });
    }

    // Generate new access and refresh tokens
    const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
      await generateToken(user);
    return {
      newAccessToken: accessToken,
      newRefreshToken: refreshToken,
      newAccessTokenExp: accessTokenExp,
      newRefreshTokenExp: refreshTokenExp,
    };
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ status: "failed", message: "Internal server error" });
  }
};

module.exports = {
  generateToken,
  isTokenExpire,
  setTokenCookies,
  verifyRefreshToken,
  refreshAccessToken,
};
