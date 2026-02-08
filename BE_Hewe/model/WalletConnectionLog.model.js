const mongoose = require('mongoose');

const walletConnectionLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    connectedWalletAddress: {
        type: String,
        required: true,
        lowercase: true,
        index: true
    },
    registeredWalletAddress: {
        type: String,
        lowercase: true,
        default: null
    },
    isDifferentWallet: {
        type: Boolean,
        default: false
    },
    chainId: {
        type: Number,
        required: true
    },
    userAgent: {
        type: String,
        default: null
    },
    ipAddress: {
        type: String,
        default: null
    },
    connectedAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    disconnectedAt: {
        type: Date,
        default: null
    },
    sessionDuration: {
        type: Number, // in seconds
        default: null
    }
}, {
    timestamps: true
});

// Compound indexes for efficient queries
walletConnectionLogSchema.index({ userId: 1, connectedAt: -1 });
walletConnectionLogSchema.index({ connectedWalletAddress: 1, connectedAt: -1 });
walletConnectionLogSchema.index({ isDifferentWallet: 1, connectedAt: -1 });

// Virtual to check if session is active
walletConnectionLogSchema.virtual('isActive').get(function () {
    return !this.disconnectedAt;
});

const WalletConnectionLog = mongoose.model('WalletConnectionLog', walletConnectionLogSchema);

module.exports = WalletConnectionLog;
