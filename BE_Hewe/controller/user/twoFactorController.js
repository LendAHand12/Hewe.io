const USER = require("../../model/userModel");
const error = require("../../utils/error");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

// Setup 2FA - Generate QR code and secret
exports.setup2FA = async (req, res) => {
    try {
        const userId = req.user._id;

        // Generate secret
        const secret = speakeasy.generateSecret({
            name: `Hewe.io (${req.user.email})`,
            length: 32,
        });

        // Generate QR code
        const qrCode = await QRCode.toDataURL(secret.otpauth_url);

        // Save secret to user (but don't enable yet)
        await USER.updateOne(
            { _id: userId },
            { twoFactorSecret: secret.base32 }
        );

        return res.status(error.status.OK).json({
            message: "2FA setup initiated. Scan QR code with Google Authenticator.",
            status: error.status.OK,
            data: {
                qrCode,
                secret: secret.base32,
            },
        });
    } catch (err) {
        console.error("Setup 2FA error:", err);
        return res.status(error.status.InternalServerError).json({
            message: err.message,
            status: error.status.InternalServerError,
        });
    }
};

// Verify and enable 2FA
exports.verify2FA = async (req, res) => {
    try {
        const userId = req.user._id;
        const { token } = req.body;

        const user = await USER.findById(userId);

        if (!user.twoFactorSecret) {
            return res.status(error.status.UnprocessableEntity).json({
                message: "Please setup 2FA first.",
                status: error.status.UnprocessableEntity,
            });
        }

        // Verify token
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
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
        await USER.updateOne(
            { _id: userId },
            { twoFactorEnabled: true }
        );

        return res.status(error.status.OK).json({
            message: "2FA enabled successfully.",
            status: error.status.OK,
        });
    } catch (err) {
        console.error("Verify 2FA error:", err);
        return res.status(error.status.InternalServerError).json({
            message: err.message,
            status: error.status.InternalServerError,
        });
    }
};

// Disable 2FA
exports.disable2FA = async (req, res) => {
    try {
        const userId = req.user._id;
        const { password } = req.body;

        const user = await USER.findById(userId);

        // Verify password
        const bcrypt = require("bcrypt");
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(error.status.UnprocessableEntity).json({
                message: "Invalid password.",
                status: error.status.UnprocessableEntity,
            });
        }

        // Disable 2FA
        await USER.updateOne(
            { _id: userId },
            {
                twoFactorEnabled: false,
                twoFactorSecret: null,
            }
        );

        return res.status(error.status.OK).json({
            message: "2FA disabled successfully.",
            status: error.status.OK,
        });
    } catch (err) {
        console.error("Disable 2FA error:", err);
        return res.status(error.status.InternalServerError).json({
            message: err.message,
            status: error.status.InternalServerError,
        });
    }
};

// Get 2FA status
exports.get2FAStatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await USER.findById(userId);

        return res.status(error.status.OK).json({
            message: "2FA status retrieved.",
            status: error.status.OK,
            data: {
                twoFactorEnabled: user.twoFactorEnabled || false,
            },
        });
    } catch (err) {
        console.error("Get 2FA status error:", err);
        return res.status(error.status.InternalServerError).json({
            message: err.message,
            status: error.status.InternalServerError,
        });
    }
};
