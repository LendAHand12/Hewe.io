const USER = require("../../model/userModel");
const ADMIN_LOG = require("../../model/adminActionLogModel");
const error = require("../../utils/error");

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await USER.findById(userId).select(
            "email name phone_number walletAddress twoFactorEnabled countryCode createdAt isLocked isDeleted"
        );

        if (!user) {
            return res.status(error.status.NotFound).json({
                message: "User not found",
                status: error.status.NotFound,
            });
        }

        return res.status(error.status.OK).json({
            message: "User profile retrieved",
            status: error.status.OK,
            data: user,
        });
    } catch (err) {
        console.error("Get user profile error:", err);
        return res.status(error.status.InternalServerError).json({
            message: err.message,
            status: error.status.InternalServerError,
        });
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { email, name, phone_number, walletAddress } = req.body;

        const user = await USER.findById(userId);
        if (!user) {
            return res.status(error.status.NotFound).json({
                message: "User not found",
                status: error.status.NotFound,
            });
        }

        // Check for duplicates (excluding current user) - case insensitive for email and name
        if (email && email !== user.email) {
            const emailExists = await USER.findOne({
                email: { $regex: new RegExp(`^${email}$`, 'i') },
                _id: { $ne: userId }
            });
            if (emailExists) {
                return res.status(error.status.BadRequest).json({
                    message: "Email already exists",
                    status: error.status.BadRequest,
                });
            }
        }

        if (name && name !== user.name) {
            const nameExists = await USER.findOne({
                name: { $regex: new RegExp(`^${name}$`, 'i') },
                _id: { $ne: userId }
            });
            if (nameExists) {
                return res.status(error.status.BadRequest).json({
                    message: "Name already exists",
                    status: error.status.BadRequest,
                });
            }
        }

        if (phone_number && phone_number !== user.phone_number) {
            const phoneExists = await USER.findOne({ phone_number, _id: { $ne: userId } });
            if (phoneExists) {
                return res.status(error.status.BadRequest).json({
                    message: "Phone number already exists",
                    status: error.status.BadRequest,
                });
            }
        }

        if (walletAddress && walletAddress !== user.walletAddress) {
            const walletExists = await USER.findOne({ walletAddress, _id: { $ne: userId } });
            if (walletExists) {
                return res.status(error.status.BadRequest).json({
                    message: "Wallet address already exists",
                    status: error.status.BadRequest,
                });
            }
        }

        // Track changes
        const changes = {};
        if (email && email !== user.email) changes.email = { old: user.email, new: email };
        if (name && name !== user.name) changes.name = { old: user.name, new: name };
        if (phone_number && phone_number !== user.phone_number)
            changes.phone_number = { old: user.phone_number, new: phone_number };
        if (walletAddress && walletAddress !== user.walletAddress)
            changes.walletAddress = { old: user.walletAddress, new: walletAddress };

        // Update user
        const updateData = {};
        if (email) updateData.email = email;
        if (name) updateData.name = name;
        if (phone_number) updateData.phone_number = phone_number;
        if (walletAddress) updateData.walletAddress = walletAddress;

        await USER.findByIdAndUpdate(userId, updateData);

        // Log update action
        await ADMIN_LOG.create({
            adminId: req.loginAdmin._id,
            adminEmail: req.loginAdmin.email,
            action: "UPDATE_USER_INFO",
            targetUserId: user._id,
            targetUserEmail: user.email,
            changes: changes,
            ipAddress: req.ip,
            userAgent: req.get("user-agent"),
        });

        return res.status(error.status.OK).json({
            message: "User profile updated successfully",
            status: error.status.OK,
        });
    } catch (err) {
        console.error("Update user profile error:", err);
        return res.status(error.status.InternalServerError).json({
            message: err.message,
            status: error.status.InternalServerError,
        });
    }
};

// Disable user 2FA
exports.disableUser2FA = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await USER.findById(userId);
        if (!user) {
            return res.status(error.status.NotFound).json({
                message: "User not found",
                status: error.status.NotFound,
            });
        }

        if (!user.twoFactorEnabled) {
            return res.status(error.status.BadRequest).json({
                message: "User 2FA is already disabled",
                status: error.status.BadRequest,
            });
        }

        // Disable 2FA
        await USER.findByIdAndUpdate(userId, {
            twoFactorEnabled: false,
            twoFactorSecret: null,
        });

        // Log disable 2FA action
        await ADMIN_LOG.create({
            adminId: req.loginAdmin._id,
            adminEmail: req.loginAdmin.email,
            action: "DISABLE_2FA",
            targetUserId: user._id,
            targetUserEmail: user.email,
            changes: {
                previousState: "enabled",
                newState: "disabled",
            },
            ipAddress: req.ip,
            userAgent: req.get("user-agent"),
        });

        return res.status(error.status.OK).json({
            message: "User 2FA disabled successfully",
            status: error.status.OK,
        });
    } catch (err) {
        console.error("Disable user 2FA error:", err);
        return res.status(error.status.InternalServerError).json({
            message: err.message,
            status: error.status.InternalServerError,
        });
    }
};

// Lock user
exports.lockUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await USER.findById(userId);
        if (!user) {
            return res.status(error.status.NotFound).json({
                message: "User not found",
                status: error.status.NotFound,
            });
        }

        if (user.isDeleted) {
            return res.status(error.status.BadRequest).json({
                message: "Cannot lock deleted user",
                status: error.status.BadRequest,
            });
        }

        if (user.isLocked) {
            return res.status(error.status.BadRequest).json({
                message: "User is already locked",
                status: error.status.BadRequest,
            });
        }

        // Lock user
        await USER.findByIdAndUpdate(userId, { isLocked: true });

        // Log action
        await ADMIN_LOG.create({
            adminId: req.loginAdmin._id,
            adminEmail: req.loginAdmin.email,
            action: "LOCK_USER",
            targetUserId: user._id,
            targetUserEmail: user.email,
            changes: {
                previousState: "unlocked",
                newState: "locked",
            },
            ipAddress: req.ip,
            userAgent: req.get("user-agent"),
        });

        return res.status(error.status.OK).json({
            message: "User locked successfully",
            status: error.status.OK,
        });
    } catch (err) {
        console.error("Lock user error:", err);
        return res.status(error.status.InternalServerError).json({
            message: err.message,
            status: error.status.InternalServerError,
        });
    }
};

// Unlock user
exports.unlockUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await USER.findById(userId);
        if (!user) {
            return res.status(error.status.NotFound).json({
                message: "User not found",
                status: error.status.NotFound,
            });
        }

        if (user.isDeleted) {
            return res.status(error.status.BadRequest).json({
                message: "Cannot unlock deleted user",
                status: error.status.BadRequest,
            });
        }

        if (!user.isLocked) {
            return res.status(error.status.BadRequest).json({
                message: "User is not locked",
                status: error.status.BadRequest,
            });
        }

        // Unlock user
        await USER.findByIdAndUpdate(userId, { isLocked: false });

        // Log action
        await ADMIN_LOG.create({
            adminId: req.loginAdmin._id,
            adminEmail: req.loginAdmin.email,
            action: "UNLOCK_USER",
            targetUserId: user._id,
            targetUserEmail: user.email,
            changes: {
                previousState: "locked",
                newState: "unlocked",
            },
            ipAddress: req.ip,
            userAgent: req.get("user-agent"),
        });

        return res.status(error.status.OK).json({
            message: "User unlocked successfully",
            status: error.status.OK,
        });
    } catch (err) {
        console.error("Unlock user error:", err);
        return res.status(error.status.InternalServerError).json({
            message: err.message,
            status: error.status.InternalServerError,
        });
    }
};

// Delete user (soft delete)
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await USER.findById(userId);
        if (!user) {
            return res.status(error.status.NotFound).json({
                message: "User not found",
                status: error.status.NotFound,
            });
        }

        if (user.isDeleted) {
            return res.status(error.status.BadRequest).json({
                message: "User is already deleted",
                status: error.status.BadRequest,
            });
        }

        // Soft delete user
        await USER.findByIdAndUpdate(userId, {
            isDeleted: true,
            isLocked: true // Also lock when deleting
        });

        // Log action
        await ADMIN_LOG.create({
            adminId: req.loginAdmin._id,
            adminEmail: req.loginAdmin.email,
            action: "DELETE_USER",
            targetUserId: user._id,
            targetUserEmail: user.email,
            changes: {
                previousState: "active",
                newState: "deleted",
            },
            ipAddress: req.ip,
            userAgent: req.get("user-agent"),
        });

        return res.status(error.status.OK).json({
            message: "User deleted successfully",
            status: error.status.OK,
        });
    } catch (err) {
        console.error("Delete user error:", err);
        return res.status(error.status.InternalServerError).json({
            message: err.message,
            status: error.status.InternalServerError,
        });
    }
};
