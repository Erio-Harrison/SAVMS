/**
 * Session Manager for Chat functionality
 * Handles userId and sessionId generation and persistence
 */
export class SessionManager {
    static STORAGE_KEYS = {
        CURRENT_SESSION_ID: 'chat_current_session_id',
        SESSION_HISTORY: 'chat_session_history'
    };

    /**
     * Generate a unique session ID
     * @returns {string} Unique session ID
     */
    static generateSessionId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 15);
        return `session_${timestamp}_${random}`;
    }

    /**
     * Get current user ID from UserContext or storage
     * @param {Object} userContext - User context object with id
     * @returns {string} User ID
     */
    static getUserId(userContext) {
        // Priority: UserContext > localStorage fallback > generate temporary
        if (userContext?.id) {
            return userContext.id.toString();
        }

        // Fallback to stored user ID or create temporary one
        let userId = localStorage.getItem('user_id');
        if (!userId) {
            userId = `temp_user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
            localStorage.setItem('user_id', userId);
        }
        return userId;
    }

    /**
     * Get current session ID or create a new one
     * @returns {string} Session ID
     */
    static getCurrentSessionId() {
        let sessionId = localStorage.getItem(this.STORAGE_KEYS.CURRENT_SESSION_ID);
        if (!sessionId) {
            sessionId = this.generateSessionId();
            this.setCurrentSessionId(sessionId);
        }
        return sessionId;
    }

    /**
     * Set current session ID
     * @param {string} sessionId - Session ID to set as current
     */
    static setCurrentSessionId(sessionId) {
        localStorage.setItem(this.STORAGE_KEYS.CURRENT_SESSION_ID, sessionId);
        this.addToSessionHistory(sessionId);
    }

    /**
     * Create a new session and set it as current
     * @returns {string} New session ID
     */
    static createNewSession() {
        const sessionId = this.generateSessionId();
        this.setCurrentSessionId(sessionId);
        return sessionId;
    }

    /**
     * Add session to history
     * @param {string} sessionId - Session ID to add
     */
    static addToSessionHistory(sessionId) {
        const history = this.getSessionHistory();
        if (!history.includes(sessionId)) {
            history.unshift(sessionId); // Add to beginning
            // Keep only last 10 sessions
            const trimmedHistory = history.slice(0, 10);
            localStorage.setItem(this.STORAGE_KEYS.SESSION_HISTORY, JSON.stringify(trimmedHistory));
        }
    }

    /**
     * Get session history
     * @returns {Array<string>} Array of session IDs
     */
    static getSessionHistory() {
        try {
            const history = localStorage.getItem(this.STORAGE_KEYS.SESSION_HISTORY);
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('Error parsing session history:', error);
            return [];
        }
    }

    /**
     * Remove session from history
     * @param {string} sessionId - Session ID to remove
     */
    static removeFromHistory(sessionId) {
        const history = this.getSessionHistory();
        const updatedHistory = history.filter(id => id !== sessionId);
        localStorage.setItem(this.STORAGE_KEYS.SESSION_HISTORY, JSON.stringify(updatedHistory));

        // If current session was removed, create a new one
        if (localStorage.getItem(this.STORAGE_KEYS.CURRENT_SESSION_ID) === sessionId) {
            this.createNewSession();
        }
    }

    /**
     * Clear all session data
     */
    static clearAllSessions() {
        localStorage.removeItem(this.STORAGE_KEYS.CURRENT_SESSION_ID);
        localStorage.removeItem(this.STORAGE_KEYS.SESSION_HISTORY);
    }

    /**
     * Get session info for display
     * @param {string} sessionId - Session ID
     * @returns {Object} Session display info
     */
    static getSessionDisplayInfo(sessionId) {
        // For database-generated IDs (ObjectId format), create display name
        if (sessionId && sessionId.length === 24 && /^[a-fA-F0-9]{24}$/.test(sessionId)) {
            // This is likely a MongoDB ObjectId
            return {
                id: sessionId,
                displayName: `Chat Session`,
                timestamp: Date.now()
            };
        }

        // Extract timestamp from session ID if it follows our custom format
        const match = sessionId.match(/session_(\d+)_/);
        if (match) {
            const timestamp = parseInt(match[1]);
            const date = new Date(timestamp);
            return {
                id: sessionId,
                displayName: `Chat ${date.toLocaleDateString('en-US')} ${date.toLocaleTimeString('en-US')}`,
                timestamp: timestamp
            };
        }

        return {
            id: sessionId,
            displayName: `Chat Session`,
            timestamp: Date.now()
        };
    }
}

export default SessionManager;