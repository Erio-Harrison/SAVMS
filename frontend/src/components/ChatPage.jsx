import React, { useState, useCallback, useRef, useEffect, useContext } from 'react';
import { Button, Modal, Chat, DragMove, Input, Space } from '@douyinfe/semi-ui';
import { IconMicrophone, IconStop } from '@douyinfe/semi-icons';
import { UserContext } from '../UserContext';
import ChatAPI from '../services/chatAPI';
import SessionManager from '../utils/sessionManager';
import './DragChat.css';

// Custom Voice Input Hook
function useVoiceInput() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Check browser support
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'zh-CN';
            
            recognition.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setTranscript(prev => prev + finalTranscript);
                }
            };
            
            recognition.onerror = (event) => {
                console.error('Voice recognition error:', event.error);
                setIsListening(false);
            };
            
            recognition.onend = () => {
                setIsListening(false);
            };
            
            recognitionRef.current = recognition;
        }
    }, []);

    const toggleListening = useCallback(() => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            if (recognitionRef.current) {
                recognitionRef.current.start();
                setIsListening(true);
            }
        }
    }, [isListening]);

    const clearTranscript = useCallback(() => {
        setTranscript('');
    }, []);

    return {
        isListening,
        transcript,
        toggleListening,
        clearTranscript,
        isSupported: 'webkitSpeechRecognition' in window
    };
}

// Custom Input Component
function CustomChatInput({ onSend, disabled = false }) {
    const [inputValue, setInputValue] = useState('');
    const { isListening, transcript, toggleListening, clearTranscript, isSupported } = useVoiceInput();

    // Update input field when voice-to-text changes
    useEffect(() => {
        if (transcript) {
            setInputValue(prev => prev + transcript);
            clearTranscript();
        }
    }, [transcript, clearTranscript]);

    const handleSend = useCallback(() => {
        if (inputValue.trim() && !disabled) {
            onSend(inputValue.trim());
            setInputValue('');
        }
    }, [inputValue, onSend, disabled]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }, [handleSend]);

    return (
        <div style={{ padding: '16px', borderTop: '1px solid #e4e6e8' }}>
            <Space style={{ width: '100%' }} align="end">
                <Input
                    style={{ flex: 1 }}
                    value={inputValue}
                    onChange={setInputValue}
                    onKeyPress={handleKeyPress}
                    placeholder={disabled ? "AI is typing..." : "Enter message..."}
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    disabled={disabled}
                />
                {isSupported && (
                    <Button
                        type={isListening ? "danger" : "tertiary"}
                        icon={isListening ? <IconStop /> : <IconMicrophone />}
                        onClick={toggleListening}
                        disabled={disabled}
                        style={{
                            backgroundColor: isListening ? '#ff4d4f' : undefined,
                            color: isListening ? '#fff' : undefined
                        }}
                    />
                )}
                <Button
                    type="primary"
                    onClick={handleSend}
                    disabled={!inputValue.trim() || disabled}
                    loading={disabled}
                >
                    Send
                </Button>
            </Space>
            {isListening && (
                <div style={{ 
                    marginTop: '8px', 
                    padding: '8px', 
                    backgroundColor: '#f0f0f0', 
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#666'
                }}>
                    🎤 Listening...
                </div>
            )}
        </div>
    );
}

// Semi UI Chat role configuration
const roleInfo = {
    user: {
        name: 'User',
        avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    },
    assistant: {
        name: 'AI Assistant',
        avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
    },
};

let idCounter = 0;
function getId() {
    return `id-${idCounter++}`;
}

export default function DragChat() {
    const [visible, setVisible] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            id: getId(),
            createAt: Date.now(),
            content: "Hello, I'm your AI assistant. How can I help you today?",
        },
    ]);

    // Get user context and session management
    const userContext = useContext(UserContext);
    const [currentSessionId, setCurrentSessionId] = useState(() => SessionManager.getCurrentSessionId());
    const [isLoading, setIsLoading] = useState(false);

    // Store mouse position when pressed
    const startPos = useRef({ x: 0, y: 0 });

    // Load session messages on mount
    useEffect(() => {
        loadSessionMessages();
    }, [currentSessionId]);

    const loadSessionMessages = useCallback(async (sessionId = currentSessionId) => {
        try {
            const userId = SessionManager.getUserId(userContext);
            const result = await ChatAPI.getSessionMessages(sessionId, userId);

            if (result.success && result.data) {
                // Convert backend messages to frontend format
                const convertedMessages = result.data.map(msg => ({
                    role: msg.role,
                    id: msg.id || getId(),
                    createAt: new Date(msg.timestamp).getTime(),
                    content: msg.content
                }));

                // Add welcome message if no messages exist
                if (convertedMessages.length === 0) {
                    setMessages([
                        {
                            role: 'assistant',
                            id: getId(),
                            createAt: Date.now(),
                            content: "Hello, I'm your AI assistant. How can I help you today?",
                        },
                    ]);
                } else {
                    setMessages(convertedMessages);
                }
            } else {
                // No messages found, show welcome message
                setMessages([
                    {
                        role: 'assistant',
                        id: getId(),
                        createAt: Date.now(),
                        content: "Hello, I'm your AI assistant. How can I help you today?",
                    },
                ]);
            }
        } catch (error) {
            console.error('Failed to load session messages:', error);
            // Show welcome message on error
            setMessages([
                {
                    role: 'assistant',
                    id: getId(),
                    createAt: Date.now(),
                    content: "Hello, I'm your AI assistant. How can I help you today?",
                },
            ]);
        }
    }, [currentSessionId, userContext]);


    // Chat send callback using backend API
    const onMessageSend = useCallback(async (userInput) => {
        if (isLoading) return; // Prevent multiple simultaneous requests

        setIsLoading(true);
        const userId = SessionManager.getUserId(userContext);

        // 1. Add user message
        const userMessage = {
            role: 'user',
            id: getId(),
            createAt: Date.now(),
            content: userInput,
        };
        setMessages(prev => [...prev, userMessage]);

        // 2. Add placeholder AI message
        const assistantMessage = {
            role: 'assistant',
            id: getId(),
            createAt: Date.now(),
            content: "",
        };
        setMessages(prev => [...prev, assistantMessage]);

        try {
            let aggregatedContent = "";

            console.log('🚀 Sending message:', { userId, sessionId: currentSessionId, message: userInput });

            // 3. Call backend streaming API
            await ChatAPI.sendMessageStream(
                userId,
                currentSessionId,
                userInput,
                // onMessage callback
                (data) => {
                    console.log('📨 Received data chunk:', `"${data}"`);
                    console.log('📨 Data length:', data.length);
                    console.log('📨 Data char codes:', [...data].map(c => c.charCodeAt(0)).join(','));
                    aggregatedContent += data;
                    setMessages(prevMsgs => {
                        const copy = [...prevMsgs];
                        copy[copy.length - 1] = {
                            ...copy[copy.length - 1],
                            content: aggregatedContent,
                        };
                        return copy;
                    });
                },
                // onError callback
                (error) => {
                    console.error("❌ Streaming error:", error);
                    setMessages(prevMsgs => {
                        const copy = [...prevMsgs];
                        copy[copy.length - 1] = {
                            ...copy[copy.length - 1],
                            content: "⚠️ Error occurred while processing your message. Please try again.",
                        };
                        return copy;
                    });
                    setIsLoading(false);
                },
                // onComplete callback
                () => {
                    console.log('✅ Streaming completed');
                    setIsLoading(false);
                }
            );
        } catch (error) {
            console.error("Failed to call backend API:", error);
            setMessages(prev => {
                const copy = [...prev];
                copy[copy.length - 1] = {
                    ...copy[copy.length - 1],
                    content: "⚠️ Unable to connect to the AI service. Please try again later.",
                };
                return copy;
            });
            setIsLoading(false);
        }
    }, [currentSessionId, userContext, isLoading]);

    return (
        <>
            {/* Draggable Chat Button */}
            <DragMove>
                <Button
                    className="drag-chat-button"
                    // Record pressed coordinates
                    onMouseDown={e => {
                        startPos.current = { x: e.clientX, y: e.clientY };
                    }}
                    // If movement is less than threshold when released, treat as click
                    onMouseUp={e => {
                        const dx = Math.abs(e.clientX - startPos.current.x);
                        const dy = Math.abs(e.clientY - startPos.current.y);
                        if (dx < 5 && dy < 5) {
                            setVisible(true);
                        }
                    }}
                >
                    Chat
                </Button>
            </DragMove>

            {/* Chat Modal */}
            <Modal
                title="Teddy — Support AI"
                visible={visible}
                footer={null}
                onCancel={() => setVisible(false)}
                width={400}
                bodyStyle={{ padding: 0 }}
                closable
            >
                <div style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <Chat
                            chats={messages}
                            roleConfig={roleInfo}
                            showClearContext={true}
                            renderInputArea={() => null} // Hide default input area
                        />
                    </div>
                    <CustomChatInput onSend={onMessageSend} disabled={isLoading} />
                </div>
            </Modal>
        </>
    );
}
