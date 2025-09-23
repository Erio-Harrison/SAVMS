package com.savms.dto;

import com.savms.entity.ChatMessage;
import com.savms.entity.ChatSession;
import org.springframework.ai.chat.messages.Message;

import java.util.List;

public class WorkflowContext {

    private ChatSession session;
    private ChatMessage userMessage;
    private String userId;
    private Intent intent;
    private ExtractedInfo extractedInfo;
    private String knowledge;
    private List<Message> messages;

    public WorkflowContext() {
    }

    public WorkflowContext(ChatSession session, ChatMessage userMessage, String userId) {
        this.session = session;
        this.userMessage = userMessage;
        this.userId = userId;
    }

    public ChatSession getSession() {
        return session;
    }

    public void setSession(ChatSession session) {
        this.session = session;
    }

    public ChatMessage getUserMessage() {
        return userMessage;
    }

    public void setUserMessage(ChatMessage userMessage) {
        this.userMessage = userMessage;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Intent getIntent() {
        return intent;
    }

    public void setIntent(Intent intent) {
        this.intent = intent;
    }

    public ExtractedInfo getExtractedInfo() {
        return extractedInfo;
    }

    public void setExtractedInfo(ExtractedInfo extractedInfo) {
        this.extractedInfo = extractedInfo;
    }

    public String getKnowledge() {
        return knowledge;
    }

    public void setKnowledge(String knowledge) {
        this.knowledge = knowledge;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }

    @Override
    public String toString() {
        return "WorkflowContext{" +
                "sessionId='" + (session != null ? session.getId() : null) + '\'' +
                ", userMessageId='" + (userMessage != null ? userMessage.getId() : null) + '\'' +
                ", userId='" + userId + '\'' +
                ", intent=" + intent +
                ", knowledgeLength=" + (knowledge != null ? knowledge.length() : 0) +
                ", messagesCount=" + (messages != null ? messages.size() : 0) +
                '}';
    }
}