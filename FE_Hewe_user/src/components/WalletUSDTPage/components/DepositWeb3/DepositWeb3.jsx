import React, { useState, useEffect } from 'react';
import { Input, Button, Card, Spin, Alert, Steps, Statistic, message } from 'antd';
import {
    WalletOutlined,
    SendOutlined,
    CheckCircleOutlined,
    LoadingOutlined,
} from '@ant-design/icons';
import './DepositWeb3.scss';
import { useWeb3Wallet } from '../../../../hooks/useWeb3Wallet';
import { formatHewe } from '../../../../util/format';
import { IconUSDT } from '../../../IconUSDT/IconUSDT';
import { SYSTEM_WALLET_ADDRESS } from '../../../../config/web3Config';
import { completeDepositWeb3API } from '../../../../services/web3Service';

const { Step } = Steps;

export const DepositWeb3 = () => {
    const {
        account,
        usdtBalance,
        isConnecting,
        isCorrectNetwork,
        isMetaMaskInstalled,
        connectWallet,
        disconnectWallet,
        switchToBSC,
        getUSDTBalance,
        depositUSDT,
    } = useWeb3Wallet();

    const [amount, setAmount] = useState('');
    const [isDepositing, setIsDepositing] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [txHash, setTxHash] = useState(null);

    // Xử lý deposit
    const handleDeposit = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            return;
        }

        if (!SYSTEM_WALLET_ADDRESS) {
            console.error('System wallet address not configured');
            return;
        }

        try {
            setIsDepositing(true);
            setCurrentStep(1);

            // Gửi transaction
            const result = await depositUSDT(amount, SYSTEM_WALLET_ADDRESS);

            if (!result) {
                setIsDepositing(false);
                setCurrentStep(0);
                return;
            }

            setTxHash(result.txHash);

            // Call API để cộng tiền vào tài khoản
            try {
                await completeDepositWeb3API({
                    txHash: result.txHash,
                    amount: parseFloat(amount),
                });

                // Transaction đã confirm on-chain, hoàn thành!
                setCurrentStep(2);
                setAmount('');

                // Refresh balance và reset sau 2 giây
                setTimeout(() => {
                    getUSDTBalance();
                    setCurrentStep(0);
                    setTxHash(null);
                }, 2000);
            } catch (apiError) {
                console.error('Error completing deposit:', apiError);
                message.error('Failed to update balance. Please contact support with transaction hash: ' + result.txHash);
                setCurrentStep(0);
            }
        } catch (error) {
            console.error('Error during deposit:', error);
        } finally {
            setIsDepositing(false);
        }
    };

    // Render nội dung theo trạng thái
    const renderContent = () => {
        // Chưa cài MetaMask
        if (!isMetaMaskInstalled) {
            return (
                <Alert
                    message="MetaMask Not Installed"
                    description={
                        <div>
                            <p>Please install MetaMask extension to use this feature.</p>
                            <Button
                                type="primary"
                                href="https://metamask.io/download/"
                                target="_blank"
                                icon={<WalletOutlined />}
                            >
                                Install MetaMask
                            </Button>
                        </div>
                    }
                    type="warning"
                    showIcon
                />
            );
        }

        // Chưa kết nối ví
        if (!account) {
            return (
                <Card className="connect-card">
                    <div className="connect-content">
                        <WalletOutlined style={{ fontSize: 64, color: '#1890ff', marginBottom: 24 }} />
                        <h2>Connect Your Wallet</h2>
                        <p>Connect your MetaMask wallet to deposit USDT quickly and securely</p>
                        <Button
                            type="primary"
                            size="large"
                            icon={<WalletOutlined />}
                            loading={isConnecting}
                            onClick={connectWallet}
                            style={{ marginTop: 16 }}
                        >
                            Connect Wallet
                        </Button>
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
                            <p>Please switch to Binance Smart Chain (BSC) network</p>
                            <Button type="primary" onClick={switchToBSC} style={{ marginTop: 8 }}>
                                Switch to BSC
                            </Button>
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
                                {account.slice(0, 6)}...{account.slice(-4)}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="label">USDT Balance:</span>
                            <span className="value balance">
                                {formatHewe(usdtBalance)} <IconUSDT />
                            </span>
                        </div>
                        <Button size="small" onClick={disconnectWallet}>
                            Disconnect
                        </Button>
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
