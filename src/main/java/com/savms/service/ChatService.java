package com.savms.service;

import com.savms.dto.ChatRequest;
import com.savms.dto.ChatResponse;
import com.savms.entity.ChatMessage;
import com.savms.entity.ChatSession;
import com.savms.repository.ChatMessageRepository;
import com.savms.repository.ChatSessionRepository;
import org.springframework.ai.chat.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ChatService {

    @Autowired
    private ChatClient chatClient;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private ChatSessionRepository chatSessionRepository;

    public com.savms.dto.ChatResponse sendMessage(ChatRequest request) {
        ChatSession session = getOrCreateSession(request);

        ChatMessage userChatMessage = new ChatMessage(
            session.getId(),
            request.getUserId(),
            request.getMessage(),
            "user"
        );
        chatMessageRepository.save(userChatMessage);

        List<ChatMessage> conversationHistory = chatMessageRepository
            .findBySessionIdOrderByTimestamp(session.getId());

        StringBuilder conversationText = new StringBuilder();
        for (ChatMessage msg : conversationHistory) {
            if ("user".equals(msg.getRole())) {
                conversationText.append("User: ").append(msg.getContent()).append("\n");
            } else if ("assistant".equals(msg.getRole())) {
                conversationText.append("Assistant: ").append(msg.getContent()).append("\n");
            }
        }

        UserMessage promptMessage = new UserMessage(conversationText.toString());
        Prompt prompt = new Prompt(promptMessage);

        String aiReply = chatClient.call(prompt).getResult().getOutput().getContent();

        ChatMessage assistantMessage = new ChatMessage(
            session.getId(),
            request.getUserId(),
            aiReply,
            "assistant"
        );
        chatMessageRepository.save(assistantMessage);

        session.setUpdatedAt(LocalDateTime.now());
        chatSessionRepository.save(session);

        return new com.savms.dto.ChatResponse(
            aiReply,
            session.getId(),
            assistantMessage.getId()
        );
    }

    private ChatSession getOrCreateSession(ChatRequest request) {
        if (request.getSessionId() != null && !request.getSessionId().isEmpty()) {
            Optional<ChatSession> existingSession = chatSessionRepository
                .findByIdAndUserId(request.getSessionId(), request.getUserId());
            if (existingSession.isPresent()) {
                return existingSession.get();
            }
        }

        ChatSession newSession = new ChatSession(
            request.getUserId(),
            "Chat " + LocalDateTime.now().toString()
        );
        chatSessionRepository.save(newSession);
        return newSession;
    }


    public List<ChatSession> getUserSessions(String userId) {
        return chatSessionRepository.findByUserIdOrderByUpdatedAtDesc(userId);
    }

    public List<ChatMessage> getSessionMessages(String sessionId, String userId) {
        Optional<ChatSession> session = chatSessionRepository.findByIdAndUserId(sessionId, userId);
        if (session.isPresent()) {
            return chatMessageRepository.findBySessionIdOrderByTimestamp(sessionId);
        }
        return new ArrayList<>();
    }

    public void deleteSession(String sessionId, String userId) {
        Optional<ChatSession> session = chatSessionRepository.findByIdAndUserId(sessionId, userId);
        if (session.isPresent()) {
            chatMessageRepository.deleteBySessionId(sessionId);
            chatSessionRepository.deleteByIdAndUserId(sessionId, userId);
        }
    }
}