require("dotenv").config();
const { ethers } = require("ethers");

// BSC RPC URL
const BSC_RPC_URL = process.env.BSC_RPC_URL || "https://bsc-dataseed1.binance.org:443";

// USDT Contract Address on BSC
const USDT_CONTRACT_ADDRESS = process.env.USDT_CONTRACT_ADDRESS || "0x55d398326f99059fF775485246999027B3197955";

// USDT ABI (minimal)
const USDT_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function decimals() view returns (uint8)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
];

/**
 * Get BSC provider
 */
const getProvider = () => {
    return new ethers.providers.JsonRpcProvider(BSC_RPC_URL);
};

/**
 * Get USDT contract instance
 */
const getUSDTContract = (providerOrSigner) => {
    const provider = providerOrSigner || getProvider();
    return new ethers.Contract(USDT_CONTRACT_ADDRESS, USDT_ABI, provider);
};

/**
 * Verify transaction on blockchain
 * @param {string} txHash - Transaction hash
 * @returns {Object} Transaction details or null if invalid
 */
const verifyTransaction = async (txHash) => {
    try {
        const provider = getProvider();

        // Get transaction
        const tx = await provider.getTransaction(txHash);
        if (!tx) {
            return { valid: false, error: "Transaction not found" };
        }

        // Get transaction receipt
        const receipt = await provider.getTransactionReceipt(txHash);
        if (!receipt) {
            return { valid: false, error: "Transaction not confirmed yet" };
        }

        // Check if transaction succeeded
        if (receipt.status !== 1) {
            return { valid: false, error: "Transaction failed" };
        }

        // Verify it's a USDT transaction
        if (tx.to.toLowerCase() !== USDT_CONTRACT_ADDRESS.toLowerCase()) {
            return { valid: false, error: "Not a USDT transaction" };
        }

        return {
            valid: true,
            tx,
            receipt,
        };
    } catch (error) {
        console.error("Error verifying transaction:", error);
        return { valid: false, error: error.message };
    }
};

/**
 * Get transaction details
 * @param {string} txHash - Transaction hash
 * @returns {Object} Transaction details
 */
const getTransactionDetails = async (txHash) => {
    try {
        const provider = getProvider();
        const usdtContract = getUSDTContract(provider);

        // Get transaction
        const tx = await provider.getTransaction(txHash);
        if (!tx) {
            throw new Error("Transaction not found");
        }

        // Get receipt
        const receipt = await provider.getTransactionReceipt(txHash);
        if (!receipt) {
            throw new Error("Transaction not confirmed");
        }

        // Parse transaction data to get transfer details
        const iface = new ethers.utils.Interface(USDT_ABI);
        const decoded = iface.parseTransaction({ data: tx.data, value: tx.value });

        // Get Transfer event from logs
        const transferEvent = receipt.logs.find((log) => {
            try {
                const parsedLog = iface.parseLog(log);
                return parsedLog.name === "Transfer";
            } catch {
                return false;
            }
        });

        let from, to, amount;

        if (transferEvent) {
            const parsedLog = iface.parseLog(transferEvent);
            from = parsedLog.args.from;
            to = parsedLog.args.to;
            amount = parsedLog.args.value;
        } else if (decoded && decoded.name === "transfer") {
            from = tx.from;
            to = decoded.args._to || decoded.args.to;
            amount = decoded.args._value || decoded.args.value;
        } else {
            throw new Error("Could not parse transfer details");
        }

        return {
            txHash: tx.hash,
            from: from.toLowerCase(),
            to: to.toLowerCase(),
            amount: ethers.utils.formatUnits(amount, 18), // USDT on BSC has 18 decimals
            blockNumber: receipt.blockNumber,
            timestamp: (await provider.getBlock(receipt.blockNumber)).timestamp,
            status: receipt.status === 1 ? "success" : "failed",
            gasUsed: receipt.gasUsed.toString(),
        };
    } catch (error) {
        console.error("Error getting transaction details:", error);
        throw error;
    }
};

/**
 * Get USDT balance of an address
 * @param {string} address - Wallet address
 * @returns {string} Balance in USDT
 */
const getUSDTBalance = async (address) => {
    try {
        const usdtContract = getUSDTContract();
        const balance = await usdtContract.balanceOf(address);
        return ethers.utils.formatUnits(balance, 18);
    } catch (error) {
        console.error("Error getting USDT balance:", error);
        return "0";
    }
};

/**
 * Get current block number
 */
const getCurrentBlockNumber = async () => {
    try {
        const provider = getProvider();
        return await provider.getBlockNumber();
    } catch (error) {
        console.error("Error getting block number:", error);
        return null;
    }
};

module.exports = {
    getProvider,
    getUSDTContract,
    verifyTransaction,
    getTransactionDetails,
    getUSDTBalance,
    getCurrentBlockNumber,
    USDT_CONTRACT_ADDRESS,
    USDT_ABI,
};
