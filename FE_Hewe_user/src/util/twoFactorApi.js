import { axiosService } from "./service";

// Setup 2FA - Generate QR code and secret
export const setup2FA = async () => {
    try {
        const response = await axiosService.post("/setup2FA");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Verify and enable 2FA
export const verify2FA = async (token) => {
    try {
        const response = await axiosService.post("/verify2FA", { token });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Disable 2FA
export const disable2FA = async (password) => {
    try {
        const response = await axiosService.post("/disable2FA", { password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get 2FA status
export const get2FAStatus = async () => {
    try {
        const response = await axiosService.get("/get2FAStatus");
        return response.data;
    } catch (error) {
        throw error;
    }
};
