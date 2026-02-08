import React, { useState, useEffect } from 'react';
import { Input, Button, Card, Spin, Alert, Steps, Statistic, message } from 'antd';
import {
    WalletOutlined,
    SendOutlined,
    CheckCircleOutlined,
    LoadingOutlined,
} from '@ant-design/icons';
import './DepositWeb3.scss';
import { ConnectKitButton } from 'connectkit';
import { useAccount, useChainId, useWalletClient } from 'wagmi';
import { ethers } from 'ethers';
import { formatHewe } from '../../../../util/format';
import { IconUSDT } from '../../../IconUSDT/IconUSDT';
import { SYSTEM_WALLET_ADDRESS, USDT_CONTRACT_ADDRESS, USDT_ABI, BSC_CHAIN_ID } from '../../../../config/web3Config';
import { completeDepositWeb3API } from '../../../../services/web3Service';

const { Step } = Steps;

export const DepositWeb3 = () => {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const { data: walletClient } = useWalletClient();
    const isCorrectNetwork = chainId === BSC_CHAIN_ID;

    const [amount, setAmount] = useState('');
    const [isDepositing, setIsDepositing] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [txHash, setTxHash] = useState(null);
    const [usdtBalance, setUsdtBalance] = useState('0');

    // Fetch USDT balance
    useEffect(() => {
        const fetchUSDTBalance = async () => {
            if (!address || !isConnected || !walletClient) {
                setUsdtBalance('0');
                return;
            }

            try {
                const provider = new ethers.providers.Web3Provider(walletClient);
                const usdtContract = new ethers.Contract(
                    USDT_CONTRACT_ADDRESS,
                    USDT_ABI,
                    provider
                );
                const balance = await usdtContract.balanceOf(address);
                const formattedBalance = ethers.utils.formatUnits(balance, 18);
                setUsdtBalance(formattedBalance);
            } catch (error) {
                console.error('Error fetching USDT balance:', error);
                setUsdtBalance('0');
            }
        };

        fetchUSDTBalance();
    }, [address, isConnected, walletClient]);

    // Xử lý deposit
    const handleDeposit = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            message.error('Please enter a valid amount');
            return;
        }

        if (!SYSTEM_WALLET_ADDRESS) {
            console.error('System wallet address not configured');
            message.error('System wallet not configured');
            return;
        }

        if (!isConnected) {
            message.error('Please connect your wallet first');
            return;
        }

        if (!isCorrectNetwork) {
            message.error('Please switch to BSC network');
            return;
        }

        try {
            setIsDepositing(true);
            setCurrentStep(1);

            if (!walletClient) {
                message.error('Wallet client not available');
                setIsDepositing(false);
                setCurrentStep(0);
                return;
            }

            // Get provider from walletClient
            const provider = new ethers.providers.Web3Provider(walletClient);
            const signer = provider.getSigner();

            // Create USDT contract instance
            const usdtContract = new ethers.Contract(
                USDT_CONTRACT_ADDRESS,
                USDT_ABI,
                signer
            );

            // Convert amount to wei (18 decimals for USDT on BSC)
            const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);

            message.loading({ content: 'Please confirm transaction in your wallet...', key: 'deposit' });

            // Send transaction
            const tx = await usdtContract.transfer(SYSTEM_WALLET_ADDRESS, amountInWei);

            message.loading({ content: 'Transaction submitted. Waiting for confirmation...', key: 'deposit' });

            // Wait for transaction confirmation
            const receipt = await tx.wait();

            setTxHash(receipt.transactionHash);
            message.success({ content: 'Deposit successful!', key: 'deposit' });

            // Call API để cộng tiền vào tài khoản
            try {
                await completeDepositWeb3API({
                    txHash: receipt.transactionHash,
                    amount: parseFloat(amount),
                });

                // Transaction đã confirm on-chain, hoàn thành!
                setCurrentStep(2);
                setAmount('');

                // Refresh balance và reset sau 2 giây
                setTimeout(() => {
                    // Refresh USDT balance
                    const fetchBalance = async () => {
                        if (!walletClient) return;

                        try {
                            const provider = new ethers.providers.Web3Provider(walletClient);
                            const usdtContract = new ethers.Contract(
                                USDT_CONTRACT_ADDRESS,
                                USDT_ABI,
                                provider
                            );
                            const balance = await usdtContract.balanceOf(address);
                            const formattedBalance = ethers.utils.formatUnits(balance, 18);
                            setUsdtBalance(formattedBalance);
                        } catch (error) {
                            console.error('Error refreshing balance:', error);
                        }
                    };
                    fetchBalance();
                    setCurrentStep(0);
                    setTxHash(null);
                }, 2000);
            } catch (apiError) {
                console.error('Error completing deposit:', apiError);
                message.error('Failed to update balance. Please contact support with transaction hash: ' + receipt.transactionHash);
                setCurrentStep(0);
            }
        } catch (error) {
            console.error('Error during deposit:', error);

            if (error.code === 4001) {
                message.error({ content: 'Transaction rejected by user', key: 'deposit' });
            } else if (error.code === -32603) {
                message.error({ content: 'Insufficient BNB for gas fee', key: 'deposit' });
            } else {
                message.error({ content: 'Transaction failed: ' + (error.message || 'Unknown error'), key: 'deposit' });
            }
            setCurrentStep(0);
        } finally {
            setIsDepositing(false);
        }
    };

    // Render nội dung theo trạng thái
    const renderContent = () => {
        // Chưa kết nối ví
        if (!isConnected) {
            return (
                <Card className="connect-card">
                    <div className="connect-content">
                        <WalletOutlined style={{ fontSize: 64, color: '#1890ff', marginBottom: 24 }} />
                        <h2>Connect Your Wallet</h2>
                        <p>Connect your wallet to deposit USDT quickly and securely</p>
                        <p style={{ marginBottom: 24, color: '#666' }}>
                            Supports MetaMask, Trust Wallet, Coinbase Wallet, WalletConnect and more
                        </p>
                        <ConnectKitButton />
                    </div>
                </Card>
            );
        }

        // Sai network
        if (!isCorrectNetwork) {
            return (
                <Alert
                    message="Wrong Network"
                    description={
                        <div>
                            <p>Please switch to Binance Smart Chain (BSC) network in your wallet</p>
                            <p style={{ marginTop: 8, color: '#666' }}>Current network: {chainId}</p>
                        </div>
                    }
                    type="error"
                    showIcon
                />
            );
        }

        // Đã kết nối - hiển thị form deposit
        return (
            <div className="deposit-form">
                {/* Wallet Info */}
                <Card className="wallet-info-card">
                    <div className="wallet-info">
                        <div className="info-item">
                            <span className="label">Connected Wallet:</span>
                            <span className="value">
                                {address.slice(0, 6)}...{address.slice(-4)}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="label">USDT Balance:</span>
                            <span className="value balance">
                                {formatHewe(usdtBalance)} <IconUSDT />
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Deposit Steps */}
                {currentStep > 0 && (
                    <Card className="steps-card" style={{ marginTop: 16 }}>
                        <Steps current={currentStep} size="small">
                            <Step title="Input Amount" icon={<CheckCircleOutlined />} />
                            <Step
                                title="Confirm Transaction"
                                icon={currentStep === 1 ? <LoadingOutlined /> : null}
                            />
                            <Step
                                title="Complete"
                                icon={currentStep === 2 ? <LoadingOutlined /> : null}
                            />
                        </Steps>
                    </Card>
                )}

                {/* Deposit Form */}
                <Card className="deposit-card" style={{ marginTop: 16 }}>
                    <h3>Deposit USDT</h3>

                    <div className="input-group">
                        <label>Amount (USDT)</label>
                        <Input
                            size="large"
                            type="number"
                            placeholder="Enter amount (min: 5 USDT)"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            disabled={isDepositing}
                            suffix={<IconUSDT />}
                        />
                        <div className="quick-amounts">
                            <Button size="small" onClick={() => setAmount('10')}>
                                10
                            </Button>
                            <Button size="small" onClick={() => setAmount('50')}>
                                50
                            </Button>
                            <Button size="small" onClick={() => setAmount('100')}>
                                100
                            </Button>
                            <Button size="small" onClick={() => setAmount(usdtBalance)}>
                                Max
                            </Button>
                        </div>
                    </div>

                    <Button
                        type="primary"
                        size="large"
                        block
                        icon={<SendOutlined />}
                        loading={isDepositing}
                        disabled={!amount || parseFloat(amount) < 5 || parseFloat(amount) > parseFloat(usdtBalance)}
                        onClick={handleDeposit}
                        style={{ marginTop: 16 }}
                    >
                        {isDepositing ? 'Processing...' : 'Deposit Now'}
                    </Button>

                    {txHash && (
                        <Alert
                            message="Transaction Submitted"
                            description={
                                <div>
                                    <p>Transaction Hash:</p>
                                    <a
                                        href={`https://bscscan.com/tx/${txHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {txHash.slice(0, 10)}...{txHash.slice(-8)}
                                    </a>
                                </div>
                            }
                            type="success"
                            showIcon
                            style={{ marginTop: 16 }}
                        />
                    )}
                </Card>

                {/* Info */}
                <Card className="info-card" style={{ marginTop: 16 }}>
                    <Alert
                        message="Important Information"
                        description={
                            <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                                <li>Minimum deposit: 5 USDT</li>
                                <li>Network: Binance Smart Chain (BSC)</li>
                                <li>Your balance will be updated immediately after transaction confirms</li>
                                <li>Make sure you have enough BNB for gas fees</li>
                            </ul>
                        }
                        type="info"
                        showIcon
                    />
                </Card>
            </div>
        );
    };

    return (
        <div className="deposit-web3-container">
            <div className="header">
                <h2>Quick Deposit with Web3</h2>
                <p>Connect your wallet and deposit USDT in seconds</p>
            </div>

            {renderContent()}
        </div>
    );
};
