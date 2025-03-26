import React, { useState, useCallback } from 'react';
import { Chat } from '@douyinfe/semi-ui';

/** Role configuration for Semi UI Chat (displaying avatars and names) */
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

let id = 0;
function getId() {
    return `id-${id++}`;
}

export default function ChatPage() {
    /** State for storing messages */
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            id: getId(),
            createAt: Date.now(),
            content: "Hello, I'm your local AI assistant. How can I help you today?",
        },
    ]);

    /**
     * Called when the user sends a message via the Chat component.
     * It adds the user message and then calls the Ollama /api/generate endpoint
     * in non-streaming mode. The full response is then appended as an AI message.
     */
    const onMessageSend = useCallback(async (userInput) => {
        // 1. Add the user message
        const userMessage = {
            role: 'user',
            id: getId(),
            createAt: Date.now(),
            content: userInput,
        };
        setMessages(prev => [...prev, userMessage]);

        try {
            console.log("🚀 Sending to Ollama:", userInput);

            // 2. Call the Ollama /api/generate endpoint (non-streaming mode)
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'deepseek-r1:14b',  // Change to your actual model name if needed
                    prompt: userInput,
                    stream: false,  // Non-streaming mode
                    // You can add other optional parameters here (e.g., temperature, top_k, top_p, etc.)
                }),
            });

            if (!response.ok) {
                throw new Error("Request failed with status " + response.status);
            }

            // 3. Parse the complete JSON response
            const data = await response.json();
            console.log("✅ Received response:", data);

            // Extract the AI response (assuming it's in data.response)
            const aiResponse = data.response || "";
            const assistantMessage = {
                role: 'assistant',
                id: getId(),
                createAt: Date.now(),
                content: aiResponse,
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error("❌ Error calling the Ollama API:", error);
            // Add an error message if the API call fails
            const errorMessage = {
                role: 'assistant',
                id: getId(),
                createAt: Date.now(),
                content: "⚠️ Unable to connect to the local AI. Please check if the Ollama server is running.",
            };
            setMessages(prev => [...prev, errorMessage]);
        }
    }, []);

    return (
        <div style={{ padding: 24 }}>
            <h2 style={{ textAlign: 'center' }}>AI Chat Room</h2>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <Chat
                    chats={messages}
                    onMessageSend={onMessageSend}
                    roleConfig={roleInfo}
                    height={600}
                />
            </div>
        </div>
    );
}
