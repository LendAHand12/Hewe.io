const { body, check, query, param } = require("express-validator");

const AdminLoginValidate = [
  body("email").notEmpty().withMessage("Email is required"),
  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Invalid email format")
    .custom((value) => {
      if (!value.includes("@")) {
        throw new Error('Email must contain "@" symbol');
      }
      return true;
    }),
  body("password").notEmpty().withMessage("Password is required"),
];

const AdminChangePasswordValidate = [
  body("currentPassword").notEmpty().withMessage("currentPassword is required"),
  body("newPassword").notEmpty().withMessage("newPassword is required"),
];

const addLAHValidate = [body("LAH_member").notEmpty().withMessage("LAH_member is required")];

const createSubAdminValidate = [
  body("email").notEmpty().withMessage("Email is required"),
  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Invalid email format")
    .custom((value) => {
      if (!value.includes("@")) {
        throw new Error('Email must contain "@" symbol');
      }
      return true;
    }),
  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = {
  AdminLoginValidate,
  AdminChangePasswordValidate,
  addLAHValidate,
  createSubAdminValidate,
};
