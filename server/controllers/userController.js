const Users = require("../models/auth/User");
const bcrypt = require("bcrypt");
const { sendEmailVerificationOTP } = require("../utils/mail");
const EmailVerification = require("../models/auth/EmailVerification");
const {
  generateToken,
  setTokenCookies,
  refreshAccessToken,
} = require("../utils/token");
const UserRefreshToken = require("../models/auth/UserRefreshToken");
const jwt = require("jsonwebtoken");
const transporter = require("../config/emailConfig");

class UserController {
  // User Registration
  async userRegistration(req, res) {
    try {
      const { name, email, password, password_confirmation } = req.body;
      if (!name || !email || !password || !password_confirmation) {
        return res
          .status(400)
          .json({ status: "failed", message: "All fields are required" });
      }
      if (password !== password_confirmation) {
        return res.status(400).json({
          status: "failed",
          message: "Password and confirm password don't match",
        });
      }

      const existingUser = await Users.findOne({ email });
      if (existingUser) {
        return res
          .status(409)
          .json({ status: "failed", message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await new Users({
        name,
        email,
        password: hashedPassword,
      }).save();

      sendEmailVerificationOTP(req, newUser);

      res.status(201).json({
        status: "success",
        message: "Registration success",
        user: { id: newUser._id, email: newUser.email },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
        message: "Unable to Register, please try again later",
      });
    }
  }

  // User Email Verification
  async verifyEmail(req, res) {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res
          .status(400)
          .json({ status: "failed", message: "All fields are required" });
      }
      const existingUser = await Users.findOne({ email });
      if (!existingUser) {
        return res
          .status(404)
          .json({ status: "failed", message: "Email doesn't exists" });
      }

      if (existingUser.is_verified) {
        return res
          .status(400)
          .json({ status: "failed", message: "Email is already verified" });
      }

      const emailVerification = await EmailVerification.findOne({
        userId: existingUser._id,
        otp,
      });
      if (!emailVerification) {
        if (!existingUser.is_verified) {
          await sendEmailVerificationOTP(req, existingUser);
          return res.status(400).json({
            status: "failed",
            message: "Invalid OTP, new OTP send to your email",
          });
        }

        return res
          .status(400)
          .json({ status: "failed", message: "Invalid OTP" });
      }

      // If OTP is epirexed
      const currentTime = new Date();
      const expirationTime = new Date(
        emailVerification.createAt.getTime() + 15 * 60 * 1000
      );
      if (currentTime > expirationTime) {
        await sendEmailVerificationOTP(req, existingUser);
        return res.status(400).json({
          status: "failed",
          message: "OTP expired, new OTP send to your email",
        });
      }

      // OTP not valid and not expired, mark as email verified
      existingUser.is_verified = true;
      await existingUser.save();

      // Delete email verification document
      await EmailVerification.deleteMany({ userId: existingUser._id });
      return res
        .status(200)
        .json({ status: "success", message: "Email verified successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
        message: "Unable to Register, please try again later",
      });
    }
  }
  // User Login
  async userLogin(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ status: "failed", message: "All fields are required" });
      }

      const user = await Users.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ status: "failed", message: "User not found" });
      }

      if (!user.is_verified) {
        return res
          .status(401)
          .json({ status: "failed", message: "Your account is not verified" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ status: "failed", message: "Invalid Email or Password" });
      }

      //Generate Access Token
      const { accessToken, accessTokenExp, refreshToken, refreshTokenExp } =
        await generateToken(user);

      // Set Cookies
      setTokenCookies(
        res,
        accessToken,
        refreshToken,
        accessTokenExp,
        refreshTokenExp
      );

      // Send success response with token
      res.status(200).json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          roles: user.roles[0],
        },
        status: "success",
        message: "Login successfully",
        access_token: accessToken,
        refresh_token: refreshToken,
        access_token_exp: accessTokenExp,
        is_auth: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
        message: "Unable to Register, please try again later",
      });
    }
  }

  // Get New Access Token OR Refresh Token
  async getNewAccessToken(req, res) {
    try {
      const {
        newAccessToken,
        newRefreshToken,
        newAccessTokenExp,
        newRefreshTokenExp,
      } = await refreshAccessToken(req, res);

      // Set New tokens to Cookie
      setTokenCookies(
        res,
        newAccessToken,
        newRefreshToken,
        newAccessTokenExp,
        newRefreshTokenExp
      );

      res.status(200).send({
        status: "success",
        message: "New tokens generated",
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        access_token_exp: newAccessTokenExp,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: "failed", message: "Internal server error" });
    }
  }

  // Profile OR Logged in User

  async userProfile(req, res) {
    const user = req.user;
    return res.status(200).json(user);
  }

  // Change password
  async changePassword(req, res) {
    try {
      const { password, password_confirmation } = req.body;
      if (!password || !password_confirmation) {
        return res
          .status(400)
          .json({ status: "failed", message: "Password is required" });
      }

      if (password !== password_confirmation) {
        return res.status(400).json({
          status: "failed",
          message: "Password and confirm password don't matched",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(password, salt);
      await Users.findOneAndUpdate(req.user._id, {
        $set: {
          password: newPassword,
        },
      });

      return res
        .status(200)
        .json({ status: "success", message: "Password changed successfuly" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
        message: "Unable to change password, please try again later",
      });
    }
  }

  // Send password reset email
  async senUserPasswordResetEmail(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res
          .status(400)
          .json({ status: "failed", message: "Email is required" });
      }

      const user = await Users.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ status: "failed", message: "Email doesn't exsit" });
      }

      // Generate token for password reset
      const secret = user._id + process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
      const token = jwt.sign({ userId: user._id }, secret, {
        expiresIn: "15m",
      });

      // reset Link
      const resetLink = `${process.env.FRONTEND_HOST}/account/reset-password-confirm/${user._id}/${token}`;
      await transporter.sendMail({
        form: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Password Reset Link",
        html: `<p>Hello ${user.name}</p><p>Please <a href="${resetLink}">click here</a> to reset your password</p>`,
      });

      return res.status(200).json({
        status: "success",
        message: "Password reset email send. Please check your email",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
        message: "Unable to send Email, please try again later",
      });
    }
  }

  // Password reset

  async userPasswordReset(req, res) {
    try {
      const { password, password_confirmation } = req.body;
      const { id, token } = req.params;

      // Find user by ID
      const user = await Users.findById(id);
      if (!user) {
        return res
          .status(404)
          .json({ status: "failed", message: "User not found" });
      }

      // Validate token
      const new_secret = user._id + process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
      jwt.verify(token, new_secret);

      // Check password
      if (!password || !password_confirmation) {
        return res
          .status(400)
          .json({ status: "failed", message: "Password is required" });
      }

      // Check if password and confirm password match
      if (password !== password_confirmation) {
        return res.status(400).json({
          status: "failed",
          message: "Password and confirm password don't matched",
        });
      }

      // Generate salt and hash new password
      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(password, salt);

      await Users.findByIdAndUpdate(user._id, {
        $set: { password: newPassword },
      });

      return res.status(200).json({
        status: "success",
        message: "Password reset successfully",
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          status: "failed",
          message: "Token expired, please request a new password reset link",
        });
      }
      res.status(500).json({
        status: "failed",
        message: "Unable to reset password, please try a again later",
      });
    }
  }

  // Logout
  async userLogout(req, res) {
    try {
      // Optionally you can blacklist the refresh token in the database
      const refreshToken = req.cookies.refreshToken;
      await UserRefreshToken.findOneAndUpdate(
        {
          token: refreshToken,
        },
        { $set: { blacklisted: true } }
      );
      // Clear access token and refresh token cookies
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.clearCookie("is_auth");

      res
        .status(200)
        .json({ status: "success", message: "Logout successfuly" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
        message: "Unable to logout, please try again later",
      });
    }
  }
}

module.exports = new UserController();
