require("dotenv").config();
const JWT = require("jsonwebtoken");
const USER = require("../model/userModel");
const ADMIN = require("../model/adminModel");
const SESSION = require("../model/sessionModel");
const error = require("../utils/error");
const { error_500 } = require("../utils/error");

const verifyUserToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    if (!token) {
      return res.status(error.status.Unauthorized).json({
        message: "Unauthorized",
        status: error.status.Unauthorized,
      });
    }

    const session = await SESSION.findOne({ access_token: token });

    if (session) {
      let decode = JWT.verify(token, process.env.SECRET_KEY);
      if (!decode) {
        return res.status(error.status.Unauthorized).json({
          message: "Unauthorized",
          status: error.status.Unauthorized,
        });
      }
      let userData = await USER.findOne({
        _id: decode._id,
        email: decode.email,
      });
      if (!userData) {
        return res.status(error.status.Unauthorized).json({
          message: "Unauthorized",
          status: error.status.Unauthorized,
        });
      } else {
        req.user = userData;
        req.userToken = token;
      }
      next();
    } else
      return res.status(error.status.Unauthorized).json({
        message: "Unauthorized",
        status: error.status.Unauthorized,
      });
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    if (!token) {

      return res.status(error.status.Unauthorized).json({
        message: "Unauthorized",
        status: error.status.Unauthorized,
      });
    }
    const session = await SESSION.findOne({ access_token: token });

    if (session) {
      let decode = JWT.verify(token, process.env.SECRET_KEY);
      if (!decode) {
        return res.status(error.status.Unauthorized).json({
          message: "Unauthorized",
          status: error.status.Unauthorized,
        });
      }
      let adminData = await ADMIN.findOne({ _id: decode._id, email: decode.email });
      if (!adminData) {
        
        return res.status(error.status.Unauthorized).json({
          message: "Unauthorized",
          status: error.status.Unauthorized,
        });
      } else {
        req.loginAdmin = adminData;
        req.adminToken = token;
      }
      next();
    } else
      return res.status(error.status.Unauthorized).json({
        message: "Unauthorized",
        status: error.status.Unauthorized,
      });
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

module.exports = { verifyUserToken, verifyAdmin };
