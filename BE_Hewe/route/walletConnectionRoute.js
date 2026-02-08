const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const VERIFY_USER = require('../middleware/authMiddleware');
const { handleValidationErrors } = require('../middleware/handleValidationErrors');
const walletConnectionController = require('../controller/walletConnectionController');

/**
 * @route   POST /api/user/wallet/log-connection
 * @desc    Log wallet connection
 * @access  Private
 */
router.post(
    '/log-connection',
    VERIFY_USER.verifyUserToken,
    [
        body('connectedWalletAddress')
            .notEmpty()
            .withMessage('Connected wallet address is required')
            .isString()
            .withMessage('Connected wallet address must be a string')
            .matches(/^0x[a-fA-F0-9]{40}$/)
            .withMessage('Invalid wallet address format'),
        body('chainId')
            .notEmpty()
            .withMessage('Chain ID is required')
            .isInt()
            .withMessage('Chain ID must be an integer')
    ],
    handleValidationErrors,
    walletConnectionController.logWalletConnection
);

module.exports = router;
