package com.savms.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "chat_messages")
public class ChatMessage {

    @Id
    private String id;

    private String sessionId;

    private String userId;

    private String content;

    private String role; // "user" or "assistant"

    private LocalDateTime timestamp;

    private boolean streaming;

    // Constructors
    public ChatMessage() {
        this.timestamp = LocalDateTime.now();
        this.streaming = false;
    }

    public ChatMessage(String sessionId, String userId, String content, String role) {
        this();
        this.sessionId = sessionId;
        this.userId = userId;
        this.content = content;
        this.role = role;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public boolean isStreaming() {
        return streaming;
    }

    public void setStreaming(boolean streaming) {
        this.streaming = streaming;
    }

    @Override
    public String toString() {
        return "ChatMessage{" +
                "id='" + id + '\'' +
                ", sessionId='" + sessionId + '\'' +
                ", userId='" + userId + '\'' +
                ", content='" + content + '\'' +
                ", role='" + role + '\'' +
                ", timestamp=" + timestamp +
                ", streaming=" + streaming +
                '}';
    }
}