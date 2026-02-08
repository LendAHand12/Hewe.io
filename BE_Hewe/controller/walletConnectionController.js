const WalletConnectionLog = require('../model/WalletConnectionLog.model');
const USER = require('../model/userModel');
const { error_400, success, error_500 } = require('../utils/error');
const { matchedData } = require('express-validator');

/**
 * Log wallet connection
 * @route POST /api/user/wallet/log-connection
 */
exports.logWalletConnection = async (req, res) => {
    try {
        const userData = req.user;
        const userId = userData._id;

        if (!userData || !userId) {
            return error_400(res, 'User not found');
        }

        const { connectedWalletAddress, chainId } = matchedData(req);

        // Get user's registered wallet address
        const user = await USER.findById(userId);
        const registeredWalletAddress = user.walletAddress || null;

        // Check if connected wallet is different from registered wallet
        const isDifferentWallet = registeredWalletAddress
            ? connectedWalletAddress.toLowerCase() !== registeredWalletAddress.toLowerCase()
            : false;

        // Get IP address
        const ipAddress = req.ip || req.connection.remoteAddress || null;

        // Get user agent
        const userAgent = req.headers['user-agent'] || null;

        // Create log entry
        const connectionLog = new WalletConnectionLog({
            userId,
            connectedWalletAddress: connectedWalletAddress.toLowerCase(),
            registeredWalletAddress: registeredWalletAddress ? registeredWalletAddress.toLowerCase() : null,
            isDifferentWallet,
            chainId,
            userAgent,
            ipAddress,
            connectedAt: new Date()
        });

        await connectionLog.save();

        return success(res, 'Wallet connection logged successfully', {
            logId: connectionLog._id,
            isDifferentWallet
        });
    } catch (error) {
        console.error('Error logging wallet connection:', error);
        return error_500(res, 'Failed to log wallet connection');
    }
};
