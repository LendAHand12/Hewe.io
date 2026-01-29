import React, { useState, useEffect } from "react";
import { Modal, Button, Input, message } from "antd";
import { toast } from "react-toastify";
import { setup2FA, verify2FA, disable2FA, get2FAStatus } from "../../../../util/twoFactorApi";
import "./TwoFactorSettings.css";

const TwoFactorSettings = () => {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [qrCode, setQrCode] = useState("");
    const [secret, setSecret] = useState("");
    const [verificationToken, setVerificationToken] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Load 2FA status on component mount
    useEffect(() => {
        loadStatus();
    }, []);

    const loadStatus = async () => {
        try {
            const response = await get2FAStatus();
            setTwoFactorEnabled(response.data.twoFactorEnabled);
        } catch (error) {
            console.error("Error loading 2FA status:", error);
        }
    };

    const handleEnable2FA = async () => {
        setIsLoading(true);
        try {
            const response = await setup2FA();
            setQrCode(response.data.qrCode);
            setSecret(response.data.secret);
            setIsModalVisible(true);
            message.success("Scan QR code with Google Authenticator");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to setup 2FA");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify2FA = async () => {
        if (!verificationToken || verificationToken.length !== 6) {
            message.error("Please enter a valid 6-digit code");
            return;
        }

        setIsLoading(true);
        try {
            await verify2FA(verificationToken);
            message.success("2FA enabled successfully!");
            setTwoFactorEnabled(true);
            setIsModalVisible(false);
            setVerificationToken("");
            setQrCode("");
            setSecret("");
        } catch (error) {
            message.error(error?.response?.data?.message || "Invalid 2FA code");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisable2FA = async () => {
        Modal.confirm({
            title: "Disable Two-Factor Authentication",
            content: (
                <div>
                    <p>Are you sure you want to disable 2FA?</p>
                    <p style={{ color: '#ff4d4f' }}>⚠️ This will make your account less secure</p>
                    <Input.Password
                        placeholder="Enter your password to confirm"
                        id="disable-2fa-password"
                        style={{ marginTop: 10 }}
                    />
                </div>
            ),
            okText: "Disable",
            okType: "danger",
            cancelText: "Cancel",
            onOk: async () => {
                const password = document.getElementById("disable-2fa-password")?.value;
                if (!password) {
                    message.error("Please enter your password");
                    return Promise.reject();
                }

                try {
                    await disable2FA(password);
                    message.success("2FA disabled successfully");
                    setTwoFactorEnabled(false);
                } catch (error) {
                    message.error(error?.response?.data?.message || "Failed to disable 2FA");
                    return Promise.reject();
                }
            },
        });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setQrCode("");
        setSecret("");
        setVerificationToken("");
    };

    return (
        <>
            <div className="twofa-status-row">
                <span className={`status-badge ${twoFactorEnabled ? 'enabled' : 'disabled'}`}>
                    {twoFactorEnabled ? '✓ Enabled' : '✗ Disabled'}
                </span>
                {twoFactorEnabled ? (
                    <Button
                        danger
                        size="small"
                        onClick={handleDisable2FA}
                    >
                        Disable
                    </Button>
                ) : (
                    <Button
                        type="primary"
                        size="small"
                        onClick={handleEnable2FA}
                        loading={isLoading}
                    >
                        Enable
                    </Button>
                )}
            </div>

            <Modal
                title="Setup Two-Factor Authentication"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button
                        key="verify"
                        type="primary"
                        onClick={handleVerify2FA}
                        loading={isLoading}
                        disabled={!verificationToken}
                    >
                        Verify & Enable
                    </Button>,
                ]}
                width={500}
            >
                <div className="modal-content">
                    <div className="step-section">
                        <h4>Step 1: Scan QR Code</h4>
                        <p>Open Google Authenticator app and scan this QR code:</p>
                        {qrCode && (
                            <div className="qr-container">
                                <img src={qrCode} alt="QR Code" />
                            </div>
                        )}
                    </div>

                    <div className="step-section">
                        <h4>Step 2: Manual Entry (Optional)</h4>
                        <p>Or enter this secret key manually:</p>
                        {secret && (
                            <div className="secret-box">
                                <code>{secret}</code>
                            </div>
                        )}
                    </div>

                    <div className="step-section">
                        <h4>Step 3: Enter Verification Code</h4>
                        <p>Enter the 6-digit code from your app:</p>
                        <Input
                            placeholder="000000"
                            value={verificationToken}
                            onChange={(e) => setVerificationToken(e.target.value)}
                            maxLength={6}
                            style={{
                                textAlign: 'center',
                                fontSize: '20px',
                                letterSpacing: '8px',
                                fontWeight: 'bold',
                            }}
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default TwoFactorSettings;
