import * as Yup from "yup";
const registerSchema = Yup.object({
  username: Yup.string().required("Name is required"),
  email: Yup.string().required("Email is required").email("Is Email"),
  password: Yup.string().required("Password is required"),
  password_confirmation: Yup.string()
    .required("Password is required")
    .oneOf(
      [Yup.ref("password"), null],
      "Password and Confirm Password doesn't match"
    ),
});

const loginSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  password: Yup.string().required("Password is required"),
});

const resetPasswordSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
});

const resetPasswordConfirmSchema = Yup.object({
  password: Yup.string().required("Password is required"),
  password_confirmation: Yup.string()
    .required("Confirm Password is required")
    .oneOf(
      [Yup.ref("password"), null],
      "Password and Confirm Password doesn't match"
    ),
});

const verifyEmailSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  otp: Yup.string().required("OTP is required"),
});

const changePasswordSchema = Yup.object({
  password: Yup.string().required("Password is required"),
  password_confirmation: Yup.string()
    .required("Confirm Password is required")
    .oneOf(
      [Yup.ref("password"), null],
      "Password and Confirm Password doesn't match"
    ),
});

export {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  resetPasswordConfirmSchema,
  verifyEmailSchema,
  changePasswordSchema,
};
