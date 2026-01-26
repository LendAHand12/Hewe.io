const ADMIN = require("../../model/adminModel");
const error = require("../../utils/error");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const bcrypt = require("bcrypt");

// Setup 2FA - Generate secret and QR code
exports.setup2FA = async (req, res) => {
    try {
        const adminId = req.loginAdmin._id;
        const adminEmail = req.loginAdmin.email;

        // Generate secret
        const secret = speakeasy.generateSecret({
            name: `Hewe.io Admin (${adminEmail})`,
            issuer: "Hewe.io",
        });

        // Generate QR code
        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

        // Save secret temporarily (not enabled yet)
        await ADMIN.findByIdAndUpdate(adminId, {
            twoFactorSecret: secret.base32,
        });

        return res.status(error.status.OK).json({
            message: "2FA setup initiated. Please scan the QR code with Google Authenticator.",
            status: error.status.OK,
            data: {
                qrCode: qrCodeUrl,
                secret: secret.base32,
            },
        });
    } catch (e) {
        return res.status(error.status.InternalServerError).json({
            message: e.message,
            status: error.status.InternalServerError,
        });
    }
};

// Verify 2FA token and enable 2FA
exports.verify2FA = async (req, res) => {
    try {
        const adminId = req.loginAdmin._id;
        const { token } = req.body;

        if (!token) {
            return res.status(error.status.UnprocessableEntity).json({
                message: "2FA token is required.",
                status: error.status.UnprocessableEntity,
            });
        }

        const admin = await ADMIN.findById(adminId);

        if (!admin.twoFactorSecret) {
            return res.status(error.status.UnprocessableEntity).json({
                message: "Please setup 2FA first.",
                status: error.status.UnprocessableEntity,
            });
        }

        // Verify token
        const verified = speakeasy.totp.verify({
            secret: admin.twoFactorSecret,
            encoding: "base32",
            token: token,
            window: 2,
        });

        if (!verified) {
            return res.status(error.status.UnprocessableEntity).json({
                message: "Invalid 2FA token.",
                status: error.status.UnprocessableEntity,
            });
        }

        // Enable 2FA
        await ADMIN.findByIdAndUpdate(adminId, {
            twoFactorEnabled: true,
        });

        return res.status(error.status.OK).json({
            message: "2FA enabled successfully.",
            status: error.status.OK,
        });
    } catch (e) {
        return res.status(error.status.InternalServerError).json({
            message: e.message,
            status: error.status.InternalServerError,
        });
    }
};

// Disable 2FA
exports.disable2FA = async (req, res) => {
    try {
        const adminId = req.loginAdmin._id;
        const { password } = req.body;

        if (!password) {
            return res.status(error.status.UnprocessableEntity).json({
                message: "Password is required to disable 2FA.",
                status: error.status.UnprocessableEntity,
            });
        }

        const admin = await ADMIN.findById(adminId);

        // Verify password
        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
            return res.status(error.status.UnprocessableEntity).json({
                message: "Invalid password.",
                status: error.status.UnprocessableEntity,
            });
        }

        // Disable 2FA and clear secret
        await ADMIN.findByIdAndUpdate(adminId, {
            twoFactorEnabled: false,
            twoFactorSecret: null,
        });

        return res.status(error.status.OK).json({
            message: "2FA disabled successfully.",
            status: error.status.OK,
        });
    } catch (e) {
        return res.status(error.status.InternalServerError).json({
            message: e.message,
            status: error.status.InternalServerError,
        });
    }
};

// Get 2FA status
exports.get2FAStatus = async (req, res) => {
    try {
        const adminId = req.loginAdmin._id;
        const admin = await ADMIN.findById(adminId);

        return res.status(error.status.OK).json({
            message: "2FA status retrieved successfully.",
            status: error.status.OK,
            data: {
                twoFactorEnabled: admin.twoFactorEnabled || false,
            },
        });
    } catch (e) {
        return res.status(error.status.InternalServerError).json({
            message: e.message,
            status: error.status.InternalServerError,
        });
    }
};
