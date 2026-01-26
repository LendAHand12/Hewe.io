import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { setup2FA, verify2FA, disable2FA, get2FAStatus } from '../../utils/twoFactorApi';
import axios from '../../axios';
import './AdminProfile.css';

const AdminProfile = () => {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [showSetup2FA, setShowSetup2FA] = useState(false);
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [verificationToken, setVerificationToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Change Password states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        fetchTwoFactorStatus();
    }, []);

    const fetchTwoFactorStatus = async () => {
        try {
            const response = await get2FAStatus();
            setTwoFactorEnabled(response.data.twoFactorEnabled);
        } catch (error) {
            console.error('Error fetching 2FA status:', error);
        }
    };

    const handleSetup2FA = async () => {
        setIsLoading(true);
        try {
            const response = await setup2FA();
            setQrCode(response.data.qrCode);
            setSecret(response.data.secret);
            setShowSetup2FA(true);
            toast.success('Scan the QR code with Google Authenticator', {
                position: toast.POSITION.TOP_RIGHT,
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to setup 2FA', {
                position: toast.POSITION.TOP_RIGHT,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify2FA = async () => {
        if (!verificationToken) {
            toast.error('Please enter the verification code', {
                position: toast.POSITION.TOP_RIGHT,
            });
            return;
        }

        setIsLoading(true);
        try {
            await verify2FA(verificationToken);
            toast.success('2FA enabled successfully!', {
                position: toast.POSITION.TOP_RIGHT,
            });
            setTwoFactorEnabled(true);
            setShowSetup2FA(false);
            setVerificationToken('');
            setQrCode('');
            setSecret('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid verification code', {
                position: toast.POSITION.TOP_RIGHT,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisable2FA = async () => {
        const password = prompt('Enter your password to disable 2FA:');
        if (!password) return;

        setIsLoading(true);
        try {
            await disable2FA(password);
            toast.success('2FA disabled successfully', {
                position: toast.POSITION.TOP_RIGHT,
            });
            setTwoFactorEnabled(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to disable 2FA', {
                position: toast.POSITION.TOP_RIGHT,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match', {
                position: toast.POSITION.TOP_RIGHT,
            });
            return;
        }

        setIsLoading(true);
        try {
            await axios.put('/changePassword', {
                currentPassword,
                newPassword,
            });
            toast.success('Password changed successfully', {
                position: toast.POSITION.TOP_RIGHT,
            });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password', {
                position: toast.POSITION.TOP_RIGHT,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-profile-container">
            <div className="admin-profile-wrapper">
                {/* Header */}
                <div className="admin-profile-header">
                    <i className="fa-solid fa-user-gear"></i>
                    <h1 className="admin-profile-title">Admin Profile</h1>
                </div>

                <div className="admin-profile-content">
                    {/* Change Password Card */}
                    <div className="admin-profile-card">
                        <h2 className="admin-profile-card-title">Change Password</h2>
                        <form onSubmit={handleChangePassword}>
                            <div className="admin-profile-form-group">
                                <label className="admin-profile-label">Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="admin-profile-input"
                                    required
                                />
                            </div>
                            <div className="admin-profile-form-group">
                                <label className="admin-profile-label">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="admin-profile-input"
                                    required
                                />
                            </div>
                            <div className="admin-profile-form-group">
                                <label className="admin-profile-label">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="admin-profile-input"
                                    required
                                />
                            </div>
                            <button type="submit" className="admin-profile-button" disabled={isLoading}>
                                {isLoading ? 'Changing...' : 'Change Password'}
                            </button>
                        </form>
                    </div>

                    {/* Two-Factor Authentication Card */}
                    <div className="admin-profile-card">
                        <h2 className="admin-profile-card-title">Two-Factor Authentication</h2>

                        <div className="admin-profile-form-group">
                            <label className="admin-profile-label">Status</label>
                            <span className={`admin-profile-status ${twoFactorEnabled ? 'enabled' : 'disabled'}`}>
                                <i className={`fa-solid ${twoFactorEnabled ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                        </div>

                        {!twoFactorEnabled && !showSetup2FA && (
                            <button onClick={handleSetup2FA} className="admin-profile-button" disabled={isLoading}>
                                {isLoading ? 'Setting up...' : 'Setup 2FA'}
                            </button>
                        )}

                        {showSetup2FA && (
                            <div>
                                <div className="admin-profile-qr-container">
                                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#02001c' }}>
                                        Scan QR Code
                                    </h3>
                                    <p className="admin-profile-hint" style={{ marginBottom: '16px' }}>
                                        Scan this QR code with Google Authenticator app
                                    </p>
                                    {qrCode && <img src={qrCode} alt="QR Code" className="admin-profile-qr-code" />}

                                    <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '20px 0 12px', color: '#02001c' }}>
                                        Manual Entry
                                    </h3>
                                    <p className="admin-profile-hint" style={{ marginBottom: '8px' }}>
                                        Or enter this code manually in your app:
                                    </p>
                                    <code className="admin-profile-secret">{secret}</code>
                                </div>

                                <div className="admin-profile-form-group">
                                    <label className="admin-profile-label">Verification Code</label>
                                    <p className="admin-profile-hint" style={{ marginBottom: '8px' }}>
                                        Enter the 6-digit code from your authenticator app:
                                    </p>
                                    <input
                                        type="text"
                                        value={verificationToken}
                                        onChange={(e) => setVerificationToken(e.target.value)}
                                        className="admin-profile-input"
                                        placeholder="000000"
                                        maxLength={6}
                                        style={{ textAlign: 'center', fontSize: '18px', letterSpacing: '4px' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button onClick={handleVerify2FA} className="admin-profile-button" disabled={isLoading}>
                                        {isLoading ? 'Verifying...' : 'Enable 2FA'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowSetup2FA(false);
                                            setVerificationToken('');
                                            setQrCode('');
                                            setSecret('');
                                        }}
                                        className="admin-profile-button admin-profile-button-secondary"
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {twoFactorEnabled && (
                            <button onClick={handleDisable2FA} className="admin-profile-button admin-profile-button-danger" disabled={isLoading}>
                                {isLoading ? 'Disabling...' : 'Disable 2FA'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
