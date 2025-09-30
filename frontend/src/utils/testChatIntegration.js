/**
 * Test script for Chat API integration
 * This can be used to verify the backend integration works correctly
 */
import ChatAPI from '../services/chatAPI';
import SessionManager from './sessionManager';

export const testChatIntegration = async () => {
    console.log('🧪 Testing Chat API Integration...');

    try {
        // Test 1: Generate session and user IDs
        const userId = SessionManager.getUserId({ id: 'test_user_123' });
        const sessionId = SessionManager.createNewSession();

        console.log('✅ Session Management Test:', {
            userId,
            sessionId
        });

        // Test 2: Try to get existing sessions (might be empty)
        try {
            const sessionsResult = await ChatAPI.getUserSessions(userId);
            console.log('✅ Get Sessions Test:', sessionsResult);
        } catch (error) {
            console.log('❌ Get Sessions Test Failed:', error.message);
        }

        // Test 3: Try to send a simple message
        try {
            const messageResult = await ChatAPI.sendMessage(userId, sessionId, 'Hello, this is a test message');
            console.log('✅ Send Message Test:', messageResult);
        } catch (error) {
            console.log('❌ Send Message Test Failed:', error.message);
        }

        // Test 4: Try to get session messages
        try {
            const messagesResult = await ChatAPI.getSessionMessages(sessionId, userId);
            console.log('✅ Get Messages Test:', messagesResult);
        } catch (error) {
            console.log('❌ Get Messages Test Failed:', error.message);
        }

        console.log('🎉 Chat API Integration Test Complete!');

    } catch (error) {
        console.error('❌ Chat API Integration Test Failed:', error);
    }
};

// Test streaming functionality
export const testStreamingChat = (userId, sessionId, message = 'Test streaming message') => {
    console.log('🔄 Testing Streaming Chat...');

    let receivedContent = '';

    return ChatAPI.sendMessageStream(
        userId,
        sessionId,
        message,
        // onMessage
        (data) => {
            receivedContent += data;
            console.log('📨 Received chunk:', data);
        },
        // onError
        (error) => {
            console.error('❌ Streaming error:', error);
        },
        // onComplete
        () => {
            console.log('✅ Streaming complete. Full message:', receivedContent);
        }
    );
};

export default { testChatIntegration, testStreamingChat };