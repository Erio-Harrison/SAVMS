import axiosInstance from '../axiosInstance';

/**
 * Chat API service for backend communication
 */
export class ChatAPI {
    static BASE_URL = '/api/chat';

    /**
     * Send a message and get a complete response
     * @param {string} userId - User ID
     * @param {string} sessionId - Session ID
     * @param {string} message - Message content
     * @returns {Promise<Object>} ChatResponse
     */
    static async sendMessage(userId, sessionId, message) {
        try {
            const response = await axiosInstance.post(`${this.BASE_URL}/message`, {
                userId: userId,
                sessionId: sessionId,
                message: message
            });
            return response.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    /**
     * Send a message and get streaming response using Server-Sent Events
     * @param {string} userId - User ID
     * @param {string} sessionId - Session ID
     * @param {string} message - Message content
     * @param {Function} onMessage - Callback for each message chunk
     * @param {Function} onError - Callback for errors
     * @param {Function} onComplete - Callback when stream completes
     * @returns {EventSource} EventSource instance for manual control
     */
    static sendMessageStream(userId, sessionId, message, onMessage, onError, onComplete) {
        const token = localStorage.getItem("JWTtoken");

        // Create proper headers for SSE request
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
            'Cache-Control': 'no-cache',
        };

        // Add Authorization header if token exists
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Use fetch for streaming as EventSource doesn't support POST with body
        return fetch(`${axiosInstance.defaults.baseURL}${this.BASE_URL}/messagestream`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                userId: userId,
                sessionId: sessionId,
                message: message
            })
        }).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            const processStream = () => {
                return reader.read().then(({ value, done }) => {
                    if (done) {
                        onComplete?.();
                        return;
                    }

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || ''; // Keep incomplete line in buffer

                    for (const line of lines) {
                        if (line.trim()) {
                            // Handle different SSE formats - use original line to preserve spaces
                            if (line.trim().startsWith('data:')) {
                                // Remove 'data:' prefix but preserve all spaces in content
                                const dataIndex = line.indexOf('data:');
                                if (dataIndex !== -1) {
                                    const data = line.substring(dataIndex + 5); // Remove 'data:' but keep spaces

                                    if (data && data.trim() !== '[DONE]' && data.trim() !== 'null') {
                                        try {
                                            // Try to parse as JSON first (if backend sends structured data)
                                            const parsedData = JSON.parse(data.trim());
                                            onMessage?.(parsedData.content || parsedData.data || data);
                                        } catch (e) {
                                            // If not JSON, treat as plain text and preserve all spaces
                                            onMessage?.(data);
                                        }
                                    }
                                }
                            } else if (line.trim().startsWith('event:')) {
                                // Handle event types if needed
                                const eventType = line.substring(line.indexOf('event:') + 6).trim();
                                if (eventType === 'error') {
                                    onError?.(new Error('Server sent error event'));
                                }
                            } else if (line.trim()) {
                                // Handle plain text without data: prefix - preserve original spacing
                                onMessage?.(line);
                            }
                        }
                    }

                    return processStream();
                });
            };

            return processStream();
        }).catch(error => {
            console.error('Error in stream:', error);
            onError?.(error);
        });
    }

    /**
     * Get all chat sessions for a user
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Sessions list
     */
    static async getUserSessions(userId) {
        try {
            const response = await axiosInstance.get(`${this.BASE_URL}/sessions`, {
                params: { userId }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting user sessions:', error);
            throw error;
        }
    }

    /**
     * Get all messages in a specific session
     * @param {string} sessionId - Session ID
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Messages list
     */
    static async getSessionMessages(sessionId, userId) {
        try {
            const response = await axiosInstance.get(`${this.BASE_URL}/sessions/${sessionId}/messages`, {
                params: { userId }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting session messages:', error);
            throw error;
        }
    }

    /**
     * Delete a chat session
     * @param {string} sessionId - Session ID
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Success message
     */
    static async deleteSession(sessionId, userId) {
        try {
            const response = await axiosInstance.delete(`${this.BASE_URL}/sessions/${sessionId}`, {
                params: { userId }
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting session:', error);
            throw error;
        }
    }
}

export default ChatAPI;