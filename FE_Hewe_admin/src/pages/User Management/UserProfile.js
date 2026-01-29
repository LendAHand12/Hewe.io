import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
    Paper,
    TextField,
    Button,
    Grid,
    Typography,
    Box,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    makeStyles,
} from "@material-ui/core";
import { toast } from "react-toastify";
import axios from "../../axios";
import Overlay from "../../components/Overlay";
import { DashboardContainer, DashboardWrapper, DashHeading } from "./BlogElements";
import "./UserProfile.css";

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: "2rem",
        marginTop: "2rem",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem",
    },
    buttonGroup: {
        "& > *": {
            marginLeft: theme.spacing(1),
        },
    },
    twoFASection: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(2),
        marginTop: theme.spacing(2),
    },
}));

const UserProfile = () => {
    const classes = useStyles();
    const { userId } = useParams();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        phone_number: "",
        walletAddress: "",
    });
    const [disable2FADialog, setDisable2FADialog] = useState(false);
    const [lockDialog, setLockDialog] = useState(false);
    const [unlockDialog, setUnlockDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, [userId]);

    const fetchUserProfile = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/user/${userId}/profile`);
            setUserData(response.data.data);
            setFormData({
                email: response.data.data.email || "",
                name: response.data.data.name || "",
                phone_number: response.data.data.phone_number || "",
                walletAddress: response.data.data.walletAddress || "",
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to load user profile");
            history.goBack();
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await axios.put(`/user/${userId}/profile`, formData);
            toast.success("User profile updated successfully");
            setEditMode(false);
            fetchUserProfile();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleDisable2FA = async () => {
        setLoading(true);
        try {
            await axios.post(`/user/${userId}/disable-2fa`);
            toast.success("User 2FA disabled successfully");
            setDisable2FADialog(false);
            fetchUserProfile();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to disable 2FA");
        } finally {
            setLoading(false);
        }
    };

    const handleLockUser = async () => {
        setLoading(true);
        try {
            await axios.post(`/user/${userId}/lock`);
            toast.success("User locked successfully");
            setLockDialog(false);
            fetchUserProfile();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to lock user");
        } finally {
            setLoading(false);
        }
    };

    const handleUnlockUser = async () => {
        setLoading(true);
        try {
            await axios.post(`/user/${userId}/unlock`);
            toast.success("User unlocked successfully");
            setUnlockDialog(false);
            fetchUserProfile();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to unlock user");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        setLoading(true);
        try {
            await axios.delete(`/user/${userId}`);
            toast.success("User deleted successfully");
            setDeleteDialog(false);
            setTimeout(() => history.push('/adminPanel/user-management'), 1500);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to delete user");
        } finally {
            setLoading(false);
        }
    };

    if (!userData) return loading ? <Overlay /> : null;

    return (
        <DashboardContainer>
            <DashboardWrapper>
                <div className="user-profile-container">
                    <div className="user-profile-header">
                        <Button onClick={() => history.goBack()} variant="outlined" color="primary">
                            ← Back to Users
                        </Button>
                        <Typography variant="h4">
                            User Profile
                        </Typography>
                    </div>

                    <Paper className="user-profile-paper">
                        <div className="user-profile-section-header">
                            <Typography variant="h6">User Information</Typography>
                            <div className="user-profile-button-group">
                                {!editMode ? (
                                    <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>
                                        Edit Profile
                                    </Button>
                                ) : (
                                    <>
                                        <Button onClick={() => {
                                            setEditMode(false);
                                            setFormData({
                                                email: userData.email || "",
                                                name: userData.name || "",
                                                phone_number: userData.phone_number || "",
                                                walletAddress: userData.walletAddress || "",
                                            });
                                        }}>
                                            Cancel
                                        </Button>
                                        <Button variant="contained" color="primary" onClick={handleSave}>
                                            Save Changes
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <label className="user-profile-label">Email</label>
                                <TextField
                                    fullWidth
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={!editMode}
                                    variant="outlined"
                                    placeholder="Enter email"
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <label className="user-profile-label">Username</label>
                                <TextField
                                    fullWidth
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={!editMode}
                                    variant="outlined"
                                    placeholder="Enter username"
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <label className="user-profile-label">Phone Number</label>
                                <TextField
                                    fullWidth
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleInputChange}
                                    disabled={!editMode}
                                    variant="outlined"
                                    placeholder="Enter phone number"
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <label className="user-profile-label">Wallet Address</label>
                                <TextField
                                    fullWidth
                                    name="walletAddress"
                                    value={formData.walletAddress}
                                    onChange={handleInputChange}
                                    disabled={!editMode}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <div className="user-profile-2fa-section">
                                    <Typography variant="subtitle1">
                                        Two-Factor Authentication:
                                    </Typography>
                                    <Chip
                                        label={userData.twoFactorEnabled ? "Enabled" : "Disabled"}
                                        color={userData.twoFactorEnabled ? "primary" : "default"}
                                    />
                                    {userData.twoFactorEnabled && (
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => setDisable2FADialog(true)}
                                        >
                                            Disable 2FA
                                        </Button>
                                    )}
                                </div>
                            </Grid>

                            <Grid item xs={12}>
                                <div className="user-profile-2fa-section">
                                    <Typography variant="subtitle1">
                                        Account Status:
                                    </Typography>
                                    <Chip
                                        label={userData.isDeleted ? "Deleted" : userData.isLocked ? "Locked" : "Active"}
                                        color={userData.isDeleted || userData.isLocked ? "secondary" : "primary"}
                                    />
                                    {!userData.isDeleted && (
                                        <>
                                            {userData.isLocked === true ? (
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={() => setUnlockDialog(true)}
                                                >
                                                    Unlock User
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outlined"
                                                    style={{ borderColor: '#ff9800', color: '#ff9800' }}
                                                    onClick={() => setLockDialog(true)}
                                                >
                                                    Lock User
                                                </Button>
                                            )}
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => setDeleteDialog(true)}
                                            >
                                                Delete User
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Disable 2FA Dialog */}
                    <Dialog
                        open={disable2FADialog}
                        onClose={() => setDisable2FADialog(false)}
                        maxWidth="sm"
                        fullWidth
                        className="user-profile-dialog"
                    >
                        <DialogTitle>Disable User 2FA</DialogTitle>
                        <DialogContent>
                            <Typography variant="body1" paragraph style={{ marginTop: '1rem' }}>
                                ⚠️ Are you sure you want to disable two-factor authentication for this user?
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                This action will be logged for security purposes.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDisable2FADialog(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDisable2FA}
                                color="secondary"
                                variant="contained"
                            >
                                Disable 2FA
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Lock User Dialog */}
                    <Dialog open={lockDialog} onClose={() => setLockDialog(false)} maxWidth="sm" fullWidth className="user-profile-dialog">
                        <DialogTitle>Lock User Account</DialogTitle>
                        <DialogContent>
                            <Typography variant="body1" paragraph style={{ marginTop: '1rem' }}>
                                🔒 Are you sure you want to lock this user account?
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                The user will not be able to login until unlocked. This action will be logged.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setLockDialog(false)}>Cancel</Button>
                            <Button onClick={handleLockUser} style={{ backgroundColor: '#ff9800', color: '#fff' }} variant="contained">
                                Lock User
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Unlock User Dialog */}
                    <Dialog open={unlockDialog} onClose={() => setUnlockDialog(false)} maxWidth="sm" fullWidth className="user-profile-dialog">
                        <DialogTitle>Unlock User Account</DialogTitle>
                        <DialogContent>
                            <Typography variant="body1" paragraph style={{ marginTop: '1rem' }}>
                                🔓 Are you sure you want to unlock this user account?
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                The user will be able to login again. This action will be logged.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setUnlockDialog(false)}>Cancel</Button>
                            <Button onClick={handleUnlockUser} color="primary" variant="contained">
                                Unlock User
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Delete User Dialog */}
                    <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} maxWidth="sm" fullWidth className="user-profile-dialog">
                        <DialogTitle>Delete User Account</DialogTitle>
                        <DialogContent>
                            <Typography variant="body1" paragraph style={{ marginTop: '1rem' }}>
                                ⚠️ Are you sure you want to delete this user account?
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                This is a soft delete. The user will not be able to login and data will be preserved. This action cannot be undone and will be logged.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
                            <Button onClick={handleDeleteUser} color="secondary" variant="contained">
                                Delete User
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {loading && <Overlay />}
                </div>
            </DashboardWrapper>
        </DashboardContainer>
    );
};

export default UserProfile;
