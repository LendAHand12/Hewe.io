// Web3 Configuration for BSC Network

// BSC Mainnet Configuration
export const BSC_CHAIN_ID = 56;
export const BSC_CHAIN_ID_HEX = '0x38';
export const BSC_RPC_URL = 'https://bsc-dataseed1.binance.org:443';
export const BSC_EXPLORER = 'https://bscscan.com';

// USDT Contract on BSC
export const USDT_CONTRACT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';

// System Wallet Address (ví chung của hệ thống)
export const SYSTEM_WALLET_ADDRESS = process.env.REACT_APP_SYSTEM_WALLET_ADDRESS;

// USDT ABI (chỉ cần các function cần thiết)
export const USDT_ABI = [
    // balanceOf
    {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function',
    },
    // transfer
    {
        constant: false,
        inputs: [
            { name: '_to', type: 'address' },
            { name: '_value', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ name: '', type: 'bool' }],
        type: 'function',
    },
    // decimals
    {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint8' }],
        type: 'function',
    },
    // symbol
    {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [{ name: '', type: 'string' }],
        type: 'function',
    },
    // Transfer event
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: 'from', type: 'address' },
            { indexed: true, name: 'to', type: 'address' },
            { indexed: false, name: 'value', type: 'uint256' },
        ],
        name: 'Transfer',
        type: 'event',
    },
];

// BSC Network Config for wallet
export const BSC_NETWORK_CONFIG = {
    chainId: BSC_CHAIN_ID_HEX,
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
    },
    rpcUrls: [BSC_RPC_URL],
    blockExplorerUrls: [BSC_EXPLORER],
};

// Minimum deposit amount (USDT)
export const MIN_DEPOSIT_AMOUNT = 5;

// WalletConnect Project ID (cần đăng ký tại https://cloud.walletconnect.com)
export const WALLETCONNECT_PROJECT_ID = 'YOUR_PROJECT_ID'; // TODO: Thay bằng project ID thật

// Supported Wallets
export const SUPPORTED_WALLETS = [
    {
        id: 'metamask',
        name: 'MetaMask',
        icon: '🦊',
        description: 'Connect using MetaMask browser extension',
    },
    {
        id: 'walletconnect',
        name: 'WalletConnect',
        icon: '📱',
        description: 'Scan QR code with your mobile wallet',
    },
    {
        id: 'trustwallet',
        name: 'Trust Wallet',
        icon: '🛡️',
        description: 'Connect using Trust Wallet',
    },
];
