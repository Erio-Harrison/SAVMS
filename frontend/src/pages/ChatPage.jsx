import React, { useState, useCallback } from 'react';
import { Chat } from '@douyinfe/semi-ui';

/** Role configuration for the Semi UI Chat (to display avatars and names) */
const roleInfo = {
    user: {
        name: 'User',
        avatar: 'https://avatars.githubusercontent.com/u/1?v=4', // User avatar
    },
    assistant: {
        name: 'AI Assistant',
        avatar: 'https://avatars.githubusercontent.com/u/2?v=4', // AI avatar
    },
};

let id = 0;
function getId() {
    return `id-${id++}`;
}

export default function ChatPage() {
    /** Message list state */
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            id: getId(),
            createAt: Date.now(),
            content: "Hello, I'm your local AI assistant. How can I help you today?",
        },
    ]);

    /**
     * onMessageSend is called when the user sends a message in the Chat component.
     * - First, it adds the user's message to the local messages.
     * - Then, it calls the Ollama /api/generate endpoint (streaming ND-JSON).
     * - It parses each JSON object line-by-line and concatenates the `response` fields to build the final AI reply.
     */
    const onMessageSend = useCallback(async (userInput) => {
        // 1. Add the user message to the state
        const userMessage = {
            role: 'user',
            id: getId(),
            createAt: Date.now(),
            content: userInput,
        };
        setMessages((prev) => [...prev, userMessage]);

        try {
            console.log("Sending to Ollama:", userInput);

            // 2. Send a request to the Ollama /api/generate endpoint
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // Model name - change to your actual model, e.g., 'deepseek-r1:14b'
                    model: 'deepseek-r1:14b',
                    prompt: userInput,
                    stream: true, // Enable streaming response
                    // Other optional parameters like temperature, top_k, top_p, etc.
                }),
            });

            // If no response body, throw an error
            if (!response.body) {
                throw new Error("No streaming data received; the Ollama API may not support stream.");
            }

            // 3. Create an empty AI message to fill in gradually
            const assistantMessage = {
                role: 'assistant',
                id: getId(),
                createAt: Date.now(),
                content: "",
            };
            setMessages((prev) => [...prev, assistantMessage]);

            // 4. Read the chunked data stream and parse ND-JSON line by line
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let partialBuffer = "";   // Stores incomplete JSON lines
            let partialResponse = ""; // Stores the concatenated answer

            while (true) {
                const { value, done } = await reader.read();
                if (done) break; // Finished reading

                const chunk = decoder.decode(value, { stream: true });
                partialBuffer += chunk;

                // Split the buffer by newline
                const lines = partialBuffer.split('\n');
                partialBuffer = lines.pop() || ""; // Keep the last incomplete line

                for (const line of lines) {
                    if (!line.trim()) continue; // Skip empty lines
                    try {
                        const obj = JSON.parse(line);
                        // obj may contain { model, response, done, ... }
                        if (obj.response) {
                            partialResponse += obj.response;
                            // Update the AI message in real-time
                            setMessages((prevMsgs) => {
                                const updated = [...prevMsgs];
                                const lastIndex = updated.length - 1;
                                updated[lastIndex] = {
                                    ...updated[lastIndex],
                                    content: partialResponse,
                                };
                                return updated;
                            });
                        }
                        if (obj.done) {
                            console.log("Stream ended:", obj);
                        }
                    } catch (err) {
                        // Ignore JSON parse errors (likely due to incomplete JSON)
                    }
                }
            }

            console.log("AI final response:", partialResponse);

        } catch (error) {
            console.error("Failed to call the Ollama API:", error);
            // If there's an error, add an error message to the messages
            setMessages((prev) => [
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
        <div style={{ padding: 24 }}>
            <h2 style={{ textAlign: 'center' }}>SCUVMS AI DEMO PAGE</h2>
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
