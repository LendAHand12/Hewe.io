const ADMIN = require("../../model/adminModel");
const SESSION = require("../../model/sessionModel");
const ACCESS_MODULE = require("../../model/accessModuleModel");
const PERMISSION = require("../../model/permissionModel");
const error = require("../../utils/error");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const salt = 10;

exports.createSubAdmin = async (req, res) => {
  try {
    const { email, password, access_module, permissions } = req.body;
    const find = await ADMIN.findOne({ email: email.toLowerCase() });
    if (find) {
      return res.status(error.status.emailAlreadyExists).json({
        message: "User Already Exists!",
        status: error.status.emailAlreadyExists,
      });
    }
    const hashed = await bcrypt.hash(password, salt);
    const refData = {
      email: email.toLowerCase(),
      password: hashed,
      role: "SUBADMIN",
      access_module: access_module,
      permissions: permissions,
    };
    const createSubAdmin = await ADMIN.create(refData);
    const signToken = JWT.sign(
      { _id: createSubAdmin._id, email: createSubAdmin.email.toLowerCase() },
      process.env.SECRET_KEY
    );
    const createSession = await SESSION.create({
      access_token: signToken,
      admin_id: createSubAdmin._id,
    });
    if (createSubAdmin) {
      return res.status(error.status.OK).send({
        message: "Sub Admin create Successfully.",
        status: error.status.OK,
        data: createSubAdmin,
        access_Token: signToken,
        session: createSession,
      });
    }
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.deleteSubAdmin = async (req, res) => {
  try {
    const delAdmin = await ADMIN.deleteOne({ _id: req.params.id });
    return res.status(error.status.OK).json({
      message: "Sub Admin Delete Successfully!",
    });
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.editSubAdmin = async (req, res) => {
  try {
    const arrayOfEditKeys = ["access_module", "role", "permissions"];
    const objectUpdate = {};
    for (const key of arrayOfEditKeys) {
      if (req.body[key] != null) {
        objectUpdate[key] = req.body[key];
      }
    }
    const update = await ADMIN.findByIdAndUpdate({ _id: req.params.id }, objectUpdate, { new: true });
    if (update) {
      return res.status(error.status.OK).json({
        message: "Sub Admin updated Successfully!",
        data: update,
      });
    }
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.getALLSubAdmin = async (req, res) => {
  try {
    const find = await ADMIN.find().populate("access_module").populate("permissions");
    if (find.length >= 0) {
      return res.status(error.status.OK).json({
        message: "Admin get Successfully.",
        data: find,
      });
    }
    return res.status(error.status.OK).json({
      message: "No Admin",
      data: find,
    });
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.createAccessModule = async (req, res) => {
  try {
    const { access_module } = req.body;
    const refData = {
      access_module: access_module,
    };
    const createModule = await ACCESS_MODULE.create(refData);
    if (createModule) {
      return res.status(error.status.OK).json({
        message: "Module create Successfully.",
        status: error.status.OK,
        data: createModule,
      });
    }
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.getAllModule = async (req, res) => {
  try {
    const findModule = await ACCESS_MODULE.find();
    if (findModule.length >= 0) {
      return res.status(error.status.OK).json({
        message: "Module get Successfully.",
        data: findModule,
      });
    }
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.getModulesOfAdmin = async (req, res) => {
  try {
	  const loginAdmin = req.loginAdmin;
    const adminId = loginAdmin._id;
    const adminEmail = loginAdmin.email;
	  
    const findModules = await ADMIN.findOne({ email: adminEmail }).populate("access_module").populate("permissions");
    if (findModules) {
      return res.status(error.status.OK).json({
        message: "Module get Successfully.",
        data: {
          email: findModules.email,
          access_module: findModules.access_module,
          permission: findModules.permissions,
        },
      });
    }
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.deleteModule = async (req, res) => {
  try {
    const delAdmin = await ACCESS_MODULE.deleteOne({ _id: req.params.id });
    return res.status(error.status.OK).json({
      message: "Module Delete Successfully!",
    });
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.createPermissions = async (req, res) => {
  try {
    const { permission, description } = req.body;
    const refData = {
      permission: permission,
      description: description,
    };
    const createPermission = await PERMISSION.create(refData);
    if (createPermission) {
      return res.status(error.status.OK).json({
        message: "Permission create Successfully.",
        status: error.status.OK,
        data: createPermission,
      });
    }
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.getAllPermissions = async (req, res) => {
  try {
    const find = await PERMISSION.find();
    if (find.length >= 0) {
      return res.status(error.status.OK).json({
        message: "Permissions get Successfully.",
        data: find,
      });
    }
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};
