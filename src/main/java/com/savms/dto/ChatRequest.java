package com.savms.dto;

public class ChatRequest {

    private String message;
    private String sessionId;
    private String userId;

    public ChatRequest() {
    }

    public ChatRequest(String message, String sessionId, String userId) {
        this.message = message;
        this.sessionId = sessionId;
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
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

    @Override
    public String toString() {
        return "ChatRequest{" +
                "message='" + message + '\'' +
                ", sessionId='" + sessionId + '\'' +
                ", userId='" + userId + '\'' +
                '}';
    }
}