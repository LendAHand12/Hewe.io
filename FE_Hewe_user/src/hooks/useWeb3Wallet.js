import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import {
    BSC_CHAIN_ID,
    BSC_CHAIN_ID_HEX,
    BSC_NETWORK_CONFIG,
    BSC_RPC_URL,
    USDT_CONTRACT_ADDRESS,
    USDT_ABI,
    MIN_DEPOSIT_AMOUNT,
} from '../config/web3Config';
import { message } from 'antd';

// Web3Modal configuration
const getWeb3Modal = () => {
    if (typeof window === 'undefined') return null;

    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                rpc: {
                    56: BSC_RPC_URL, // BSC Mainnet
                },
            },
        },
    };

    return new Web3Modal({
        network: 'binance', // BSC
        cacheProvider: true, // Remember last connected wallet
        providerOptions,
        theme: {
            background: 'rgb(39, 49, 56)',
            main: 'rgb(199, 199, 199)',
            secondary: 'rgb(136, 136, 136)',
            border: 'rgba(195, 195, 195, 0.14)',
            hover: 'rgb(16, 26, 32)',
        },
    });
};

export const useWeb3Wallet = () => {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [chainId, setChainId] = useState(null);
    const [usdtBalance, setUsdtBalance] = useState('0');
    const [isConnecting, setIsConnecting] = useState(false);
    const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
    const [web3ModalInstance, setWeb3ModalInstance] = useState(null);

    // Kiểm tra MetaMask đã cài đặt chưa
    const isMetaMaskInstalled = () => {
        return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
    };

    // Kết nối ví với Web3Modal
    const connectWallet = useCallback(async () => {
        try {
            setIsConnecting(true);

            // Mở popup chọn ví
            const web3Modal = getWeb3Modal();
            if (!web3Modal) {
                message.error('Web3Modal not available');
                return;
            }
            const instance = await web3Modal.connect();
            setWeb3ModalInstance(instance);

            const provider = new ethers.providers.Web3Provider(instance);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            const network = await provider.getNetwork();

            setProvider(provider);
            setSigner(signer);
            setAccount(address);
            setChainId(network.chainId);

            // Kiểm tra network
            if (network.chainId !== BSC_CHAIN_ID) {
                setIsCorrectNetwork(false);
                message.warning('Please switch to Binance Smart Chain network');
            } else {
                setIsCorrectNetwork(true);
                message.success('Wallet connected successfully!');
            }

            // Lấy số dư USDT
            await getUSDTBalance(address, provider);
        } catch (error) {
            console.error('Error connecting wallet:', error);
            if (error.message && error.message.includes('User closed modal')) {
                message.info('Wallet connection cancelled');
            } else {
                message.error('Failed to connect wallet');
            }
        } finally {
            setIsConnecting(false);
        }
    }, []);

    // Ngắt kết nối ví
    const disconnectWallet = useCallback(async () => {
        // Close Web3Modal provider
        if (web3ModalInstance && web3ModalInstance.close) {
            await web3ModalInstance.close();
        }

        // Clear cached provider
        const web3Modal = getWeb3Modal();
        if (web3Modal) {
            await web3Modal.clearCachedProvider();
        }

        setAccount(null);
        setProvider(null);
        setSigner(null);
        setChainId(null);
        setUsdtBalance('0');
        setIsCorrectNetwork(false);
        setWeb3ModalInstance(null);
        message.info('Wallet disconnected');
    }, [web3ModalInstance]);

    // Chuyển sang BSC network
    const switchToBSC = useCallback(async () => {
        if (!isMetaMaskInstalled()) {
            message.error('MetaMask not installed');
            return;
        }

        try {
            // Thử chuyển sang BSC
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: BSC_CHAIN_ID_HEX }],
            });

            setIsCorrectNetwork(true);
            message.success('Switched to BSC network');
        } catch (switchError) {
            // Network chưa được thêm vào MetaMask
            if (switchError.code === 4902) {
                try {
                    // Thêm BSC network
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [BSC_NETWORK_CONFIG],
                    });

                    setIsCorrectNetwork(true);
                    message.success('BSC network added and switched');
                } catch (addError) {
                    console.error('Error adding BSC network:', addError);
                    message.error('Failed to add BSC network');
                }
            } else {
                console.error('Error switching network:', switchError);
                message.error('Failed to switch network');
            }
        }
    }, []);

    // Lấy số dư USDT
    const getUSDTBalance = useCallback(async (address, providerInstance) => {
        try {
            const currentProvider = providerInstance || provider;
            if (!currentProvider || !address) return;

            const usdtContract = new ethers.Contract(
                USDT_CONTRACT_ADDRESS,
                USDT_ABI,
                currentProvider
            );

            const balance = await usdtContract.balanceOf(address);
            const formattedBalance = ethers.utils.formatUnits(balance, 18); // USDT on BSC has 18 decimals

            setUsdtBalance(formattedBalance);
            return formattedBalance;
        } catch (error) {
            console.error('Error getting USDT balance:', error);
            return '0';
        }
    }, [provider]);

    // Gửi USDT
    const depositUSDT = useCallback(async (amount, systemWalletAddress) => {
        if (!signer || !account) {
            message.error('Please connect wallet first');
            return null;
        }

        if (!isCorrectNetwork) {
            message.error('Please switch to BSC network');
            return null;
        }

        if (parseFloat(amount) < MIN_DEPOSIT_AMOUNT) {
            message.error(`Minimum deposit amount is ${MIN_DEPOSIT_AMOUNT} USDT`);
            return null;
        }

        if (parseFloat(amount) > parseFloat(usdtBalance)) {
            message.error('Insufficient USDT balance');
            return null;
        }

        try {
            message.loading({ content: 'Preparing transaction...', key: 'deposit' });

            const usdtContract = new ethers.Contract(
                USDT_CONTRACT_ADDRESS,
                USDT_ABI,
                signer
            );

            // Convert amount to wei (18 decimals for USDT on BSC)
            const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);

            // Gửi transaction
            message.loading({ content: 'Please confirm transaction in your wallet...', key: 'deposit' });

            const tx = await usdtContract.transfer(systemWalletAddress, amountInWei);

            message.loading({ content: 'Transaction submitted. Waiting for confirmation...', key: 'deposit' });

            // Chờ transaction confirm
            const receipt = await tx.wait();
            // const receipt = {
            //     transactionHash: '0x1234567890123456789012345678901234567890123456789012345678901234',
            //     blockNumber: 1234567890,
            //     from: account,
            //     to: systemWalletAddress,
            //     amount: amount,
            // };

            message.success({ content: 'Deposit successful!', key: 'deposit' });

            // Cập nhật lại số dư
            await getUSDTBalance(account, provider);

            return {
                txHash: receipt.transactionHash,
                blockNumber: receipt.blockNumber,
                from: receipt.from,
                to: receipt.to,
                amount: amount,
            };
        } catch (error) {
            console.error('Error depositing USDT:', error);

            if (error.code === 4001) {
                message.error({ content: 'Transaction rejected by user', key: 'deposit' });
            } else if (error.code === -32603) {
                message.error({ content: 'Insufficient BNB for gas fee', key: 'deposit' });
            } else {
                message.error({ content: 'Transaction failed', key: 'deposit' });
            }

            return null;
        }
    }, [signer, account, isCorrectNetwork, usdtBalance, provider, getUSDTBalance]);

    // Lắng nghe sự kiện thay đổi account và chain
    useEffect(() => {
        if (!web3ModalInstance) return;

        const handleAccountsChanged = (accounts) => {
            if (accounts.length === 0) {
                disconnectWallet();
            } else if (accounts[0] !== account) {
                setAccount(accounts[0]);
                getUSDTBalance(accounts[0], provider);
            }
        };

        const handleChainChanged = (chainIdHex) => {
            const newChainId = parseInt(chainIdHex, 16);
            setChainId(newChainId);
            setIsCorrectNetwork(newChainId === BSC_CHAIN_ID);

            if (newChainId !== BSC_CHAIN_ID) {
                message.warning('Please switch back to BSC network');
            }
        };

        const handleDisconnect = () => {
            disconnectWallet();
        };

        // Subscribe to events (with safety checks)
        if (web3ModalInstance.on) {
            web3ModalInstance.on('accountsChanged', handleAccountsChanged);
            web3ModalInstance.on('chainChanged', handleChainChanged);
            web3ModalInstance.on('disconnect', handleDisconnect);
        }

        return () => {
            // Unsubscribe from events
            if (web3ModalInstance.removeListener) {
                web3ModalInstance.removeListener('accountsChanged', handleAccountsChanged);
                web3ModalInstance.removeListener('chainChanged', handleChainChanged);
                web3ModalInstance.removeListener('disconnect', handleDisconnect);
            }
        };
    }, [web3ModalInstance, account, provider, disconnectWallet, getUSDTBalance]);

    // Auto-connect nếu đã connect trước đó
    useEffect(() => {
        const checkConnection = async () => {
            // Check if there's a cached provider
            const web3Modal = getWeb3Modal();
            if (web3Modal && web3Modal.cachedProvider) {
                try {
                    await connectWallet();
                } catch (error) {
                    console.error('Error auto-connecting:', error);
                    // Clear cache if auto-connect fails
                    if (web3Modal) {
                        await web3Modal.clearCachedProvider();
                    }
                }
            }
        };

        checkConnection();
    }, [connectWallet]);

    return {
        // State
        account,
        chainId,
        usdtBalance,
        isConnecting,
        isCorrectNetwork,
        isMetaMaskInstalled: isMetaMaskInstalled(),

        // Functions
        connectWallet,
        disconnectWallet,
        switchToBSC,
        getUSDTBalance: () => getUSDTBalance(account, provider),
        depositUSDT,
    };
};
