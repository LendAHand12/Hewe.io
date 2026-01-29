const mongoose = require("mongoose");

const adminActionLogSchema = new mongoose.Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "admin",
            required: true,
        },
        adminEmail: {
            type: String,
            required: true,
        },
        action: {
            type: String,
            required: true,
            enum: ["UPDATE_USER_INFO", "DISABLE_2FA", "LOCK_USER", "UNLOCK_USER", "DELETE_USER"],
        },
        targetUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        targetUserEmail: {
            type: String,
            required: true,
        },
        changes: {
            type: Object, // Store what was changed
        },
        ipAddress: {
            type: String,
        },
        userAgent: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("adminActionLog", adminActionLogSchema);
