import { axiosService } from '../util/service';

// Track logged connections to prevent duplicates
const loggedConnections = new Set();
const SESSION_KEY = 'wallet_connection_session';

/**
 * Check if this connection has already been logged in current session
 */
const isConnectionLogged = (address, chainId) => {
    const key = `${address}_${chainId}`;
    return loggedConnections.has(key);
};

/**
 * Mark connection as logged
 */
const markConnectionLogged = (address, chainId) => {
    const key = `${address}_${chainId}`;
    loggedConnections.add(key);

    // Also store in sessionStorage to persist across page navigation
    try {
        const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || '{}');
        session[key] = Date.now();
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (error) {
        console.error('Error updating session storage:', error);
    }
};

/**
 * Check if connection was already logged in this session (from sessionStorage)
 */
const wasConnectionLoggedInSession = (address, chainId) => {
    try {
        const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || '{}');
        const key = `${address}_${chainId}`;
        return !!session[key];
    } catch (error) {
        return false;
    }
};

/**
 * Log wallet connection (only if not already logged)
 * @param {Object} data - Connection data
 * @param {string} data.connectedWalletAddress - Connected wallet address
 * @param {number} data.chainId - Network chain ID
 */
export const logWalletConnectionAPI = async (data) => {
    const { connectedWalletAddress, chainId } = data;

    // Check if already logged in this session
    if (isConnectionLogged(connectedWalletAddress, chainId) ||
        wasConnectionLoggedInSession(connectedWalletAddress, chainId)) {
        console.log('Connection already logged in this session, skipping...');
        return { skipped: true };
    }

    try {
        const response = await axiosService.post('/wallet/log-connection', data);

        // Mark as logged to prevent duplicates
        markConnectionLogged(connectedWalletAddress, chainId);

        return response.data;
    } catch (error) {
        console.error('Error logging wallet connection:', error);
        throw error;
    }
};
