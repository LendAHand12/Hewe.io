const { body, check, query, param } = require("express-validator");

const SignupValidate = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email").notEmpty().withMessage("Email is required"),
  check("email")
    .notEmpty()
    .isEmail()
    .withMessage("Invalid email format")
    .custom((value) => {
      if (!value.includes("@")) {
        throw new Error('Email must contain "@" symbol');
      }
      return true;
    }),
  check("password").notEmpty().withMessage("Password is required"),
  check("phone_number").notEmpty().withMessage("Phone number is required"),
  check("countryCode").notEmpty().withMessage("country code is required"),
];

const LoginValidate = [
  check("email").notEmpty().withMessage("Email is required"),
  check("email")
    .notEmpty()
    .isEmail()
    .withMessage("Invalid email format")
    .custom((value) => {
      if (!value.includes("@")) {
        throw new Error('Email must contain "@" symbol');
      }
      return true;
    }),
  check("password").notEmpty().withMessage("Password is required"),
];

const SendOtpValidation = [check("email").notEmpty().withMessage("Email id is required")];

const VerifyOtpValidation = [
  check("email").notEmpty().withMessage("Email id is required"),
  check("otp").notEmpty().withMessage("OTP is required"),
];

const setPasswordValidation = [check("newPassword").notEmpty().withMessage("newPassword is required")];

module.exports = {
  SignupValidate,
  LoginValidate,
  SendOtpValidation,
  VerifyOtpValidation,
  setPasswordValidation,
};
