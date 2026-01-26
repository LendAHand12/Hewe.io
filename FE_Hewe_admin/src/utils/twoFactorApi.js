import axios from '../axios';

// Setup 2FA - Get QR code and secret
export const setup2FA = async () => {
    const response = await axios.post('/setup2FA');
    return response.data;
};

// Verify and enable 2FA
export const verify2FA = async (token) => {
    const response = await axios.post('/verify2FA', { token });
    return response.data;
};

// Disable 2FA
export const disable2FA = async (password) => {
    const response = await axios.post('/disable2FA', { password });
    return response.data;
};

// Get 2FA status
export const get2FAStatus = async () => {
    const response = await axios.get('/get2FAStatus');
    return response.data;
};
