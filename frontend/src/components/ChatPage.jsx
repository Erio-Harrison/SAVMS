import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button, Modal, Chat, DragMove, Input, Space } from '@douyinfe/semi-ui';
import { IconMicrophone, IconStop } from '@douyinfe/semi-icons';
import './DragChat.css';

// 语音输入自定义Hook
function useVoiceInput() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef(null);

    useEffect(() => {
        // 检查浏览器支持
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
                console.error('语音识别错误:', event.error);
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

// 自定义输入组件
function CustomChatInput({ onSend }) {
    const [inputValue, setInputValue] = useState('');
    const { isListening, transcript, toggleListening, clearTranscript, isSupported } = useVoiceInput();

    // 当语音转换的文本发生变化时，更新输入框
    useEffect(() => {
        if (transcript) {
            setInputValue(prev => prev + transcript);
            clearTranscript();
        }
    }, [transcript, clearTranscript]);

    const handleSend = useCallback(() => {
        if (inputValue.trim()) {
            onSend(inputValue.trim());
            setInputValue('');
        }
    }, [inputValue, onSend]);

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
                    placeholder="输入消息..."
                    autoSize={{ minRows: 1, maxRows: 4 }}
                />
                {isSupported && (
                    <Button
                        type={isListening ? "danger" : "tertiary"}
                        icon={isListening ? <IconStop /> : <IconMicrophone />}
                        onClick={toggleListening}
                        style={{
                            backgroundColor: isListening ? '#ff4d4f' : undefined,
                            color: isListening ? '#fff' : undefined
                        }}
                    />
                )}
                <Button
                    type="primary"
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                >
                    发送
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
                    🎤 正在监听中...
                </div>
            )}
        </div>
    );
}

// Semi UI Chat 的角色配置
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
            content: "Hello, I'm your local AI assistant. How can I help you today?",
        },
    ]);

    // 存储按下时的鼠标位置
    const startPos = useRef({ x: 0, y: 0 });

    // 聊天发送回调
    const onMessageSend = useCallback(async (userInput) => {
        // 1. 添加用户消息
        const userMessage = {
            role: 'user',
            id: getId(),
            createAt: Date.now(),
            content: userInput,
        };
        setMessages(prev => [...prev, userMessage]);

        try {
            // 2. 调用 Ollama 流式接口
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'deepseek-r1:14b',
                    prompt: userInput,
                    stream: true,
                }),
            });
            if (!response.body) {
                throw new Error('No streaming data received; the Ollama API may not support stream.');
            }

            // 3. 占位 AI 消息
            const assistantMessage = {
                role: 'assistant',
                id: getId(),
                createAt: Date.now(),
                content: "",
            };
            setMessages(prev => [...prev, assistantMessage]);

            // 4. 解析 ND-JSON 数据流
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let buffer = "";
            let aggregated = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const obj = JSON.parse(line);
                        if (obj.response) {
                            aggregated += obj.response;
                            setMessages(prevMsgs => {
                                const copy = [...prevMsgs];
                                copy[copy.length - 1] = {
                                    ...copy[copy.length - 1],
                                    content: aggregated,
                                };
                                return copy;
                            });
                        }
                    } catch {
                        // 忽略解析错误
                    }
                }
            }
        } catch (error) {
            console.error("Failed to call the Ollama API:", error);
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    id: getId(),
                    createAt: Date.now(),
                    content: "⚠️ Unable to connect to the local AI. Please check if the Ollama server is running.",
                }
            ]);
        }
    }, []);

    return (
        <>
            {/* Draggable Chat Button */}
            <DragMove>
                <Button
                    className="drag-chat-button"
                    // 记录按下坐标
                    onMouseDown={e => {
                        startPos.current = { x: e.clientX, y: e.clientY };
                    }}
                    // 松开时如果位移小于阈值，则视为点击
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
                            renderInputArea={() => null} // 隐藏默认输入区域
                        />
                    </div>
                    <CustomChatInput onSend={onMessageSend} />
                </div>
            </Modal>
        </>
    );
}
