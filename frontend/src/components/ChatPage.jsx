import React, { useState, useCallback, useRef } from 'react';
import { Button, Modal, Chat, DragMove } from '@douyinfe/semi-ui';
import './DragChat.css';

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
                width={360}
                bodyStyle={{ padding: 0 }}
                closable
            >
                <Chat
                    chats={messages}
                    onMessageSend={onMessageSend}
                    roleConfig={roleInfo}
                    height={800}
                />
            </Modal>
        </>
    );
}
