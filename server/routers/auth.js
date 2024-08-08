const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const passport = require("passport");
const { setAuthHeader } = require("../middlewares/setAuthHeader");
const {
  accessTokenAutoRefresh,
} = require("../middlewares/accessTokenAutoRefresh");

// Public Router
router.route("/register").post(UserController.userRegistration);
router.route("/verify-email").post(UserController.verifyEmail);
router.route("/login").post(UserController.userLogin);
router.route("/refresh-token").post(UserController.getNewAccessToken);
router
  .route("/reset-password-link")
  .post(UserController.senUserPasswordResetEmail);
router
  .route("/reset-password/:id/:token")
  .post(UserController.userPasswordReset);

// Profile Router
router
  .route("/me")
  .get(
    accessTokenAutoRefresh,
    passport.authenticate("jwt", { session: false }),
    UserController.userProfile
  );

router
  .route("/change-password")
  .post(
    accessTokenAutoRefresh,
    passport.authenticate("jwt", { session: false }),
    UserController.changePassword
  );

router
  .route("/logout")
  .post(
    accessTokenAutoRefresh,
    passport.authenticate("jwt", { session: false }),
    UserController.userLogout
  );

module.exports = router;
