import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
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

export const useWeb3Wallet = () => {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [chainId, setChainId] = useState(null);
    const [usdtBalance, setUsdtBalance] = useState('0');
    const [isConnecting, setIsConnecting] = useState(false);
    const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

    // Kiểm tra MetaMask đã cài đặt chưa
    const isMetaMaskInstalled = () => {
        return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
    };

    // Kết nối ví
    const connectWallet = useCallback(async () => {
        if (!isMetaMaskInstalled()) {
            message.error('Please install MetaMask extension first!');
            window.open('https://metamask.io/download/', '_blank');
            return;
        }

        try {
            setIsConnecting(true);

            // Request account access
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts', []);

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
            message.error('Failed to connect wallet');
        } finally {
            setIsConnecting(false);
        }
    }, []);

    // Ngắt kết nối ví
    const disconnectWallet = useCallback(() => {
        setAccount(null);
        setProvider(null);
        setSigner(null);
        setChainId(null);
        setUsdtBalance('0');
        setIsCorrectNetwork(false);
        message.info('Wallet disconnected');
    }, []);

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

    // Lắng nghe sự kiện thay đổi account
    useEffect(() => {
        if (!isMetaMaskInstalled()) return;

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

        window.ethereum?.on('accountsChanged', handleAccountsChanged);
        window.ethereum?.on('chainChanged', handleChainChanged);

        return () => {
            window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum?.removeListener('chainChanged', handleChainChanged);
        };
    }, [account, provider, disconnectWallet, getUSDTBalance]);

    // Auto-connect nếu đã connect trước đó
    useEffect(() => {
        const checkConnection = async () => {
            if (!isMetaMaskInstalled()) return;

            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await provider.listAccounts();

                if (accounts.length > 0) {
                    // Đã connect trước đó
                    await connectWallet();
                }
            } catch (error) {
                console.error('Error checking connection:', error);
            }
        };

        checkConnection();
    }, []);

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
