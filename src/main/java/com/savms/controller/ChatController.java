package com.savms.controller;

import com.savms.dto.ChatRequest;
import com.savms.dto.ChatResponse;
import com.savms.entity.ChatMessage;
import com.savms.entity.ChatSession;
import com.savms.service.ChatService;
import com.savms.utils.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@Tag(name = "Chat", description = "AI Chat API")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/message")
    @Operation(summary = "Send a message to AI", description = "Send a message to AI and get a response")
    public ResponseEntity<Result<ChatResponse>> sendMessage(@RequestBody ChatRequest request) {
        try {
            if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Result.error("Message cannot be empty"));
            }

            if (request.getUserId() == null || request.getUserId().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Result.error("User ID is required"));
            }

            if (request.getSessionId() == null || request.getSessionId().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Result.error("Session ID is required"));
            }

            ChatResponse response = chatService.sendMessage(request);
            return ResponseEntity.ok(Result.success(response));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Result.error("Failed to process message: " + e.getMessage()));
        }
    }

    @PostMapping(value = "/messagestream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "Send a message to AI with streaming response", description = "Send a message to AI and get a streaming response using Server-Sent Events")
    public SseEmitter sendMessageStream(@RequestBody ChatRequest request) {
        try {
            if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
                SseEmitter errorEmitter = new SseEmitter();
                try {
                    errorEmitter.send(SseEmitter.event()
                        .data("Error: Message cannot be empty")
                        .name("error"));
                    errorEmitter.complete();
                } catch (Exception e) {
                    errorEmitter.completeWithError(e);
                }
                return errorEmitter;
            }

            if (request.getUserId() == null || request.getUserId().trim().isEmpty()) {
                SseEmitter errorEmitter = new SseEmitter();
                try {
                    errorEmitter.send(SseEmitter.event()
                        .data("Error: User ID is required")
                        .name("error"));
                    errorEmitter.complete();
                } catch (Exception e) {
                    errorEmitter.completeWithError(e);
                }
                return errorEmitter;
            }

            if (request.getSessionId() == null || request.getSessionId().trim().isEmpty()) {
                SseEmitter errorEmitter = new SseEmitter();
                try {
                    errorEmitter.send(SseEmitter.event()
                        .data("Error: Session ID is required")
                        .name("error"));
                    errorEmitter.complete();
                } catch (Exception e) {
                    errorEmitter.completeWithError(e);
                }
                return errorEmitter;
            }

            return chatService.sendMessageStream(request);

        } catch (Exception e) {
            SseEmitter errorEmitter = new SseEmitter();
            try {
                errorEmitter.send(SseEmitter.event()
                    .data("Error: Failed to process message: " + e.getMessage())
                    .name("error"));
                errorEmitter.complete();
            } catch (Exception sendError) {
                errorEmitter.completeWithError(sendError);
            }
            return errorEmitter;
        }
    }

    @GetMapping("/sessions")
    @Operation(summary = "Get user's chat sessions", description = "Get all chat sessions for a user")
    public ResponseEntity<Result<List<ChatSession>>> getUserSessions(@RequestParam String userId) {
        try {
            if (userId == null || userId.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Result.error("User ID is required"));
            }

            List<ChatSession> sessions = chatService.getUserSessions(userId);
            return ResponseEntity.ok(Result.success(sessions));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Result.error("Failed to get sessions: " + e.getMessage()));
        }
    }

    @GetMapping("/sessions/{sessionId}/messages")
    @Operation(summary = "Get messages in a session", description = "Get all messages in a specific chat session")
    public ResponseEntity<Result<List<ChatMessage>>> getSessionMessages(
            @PathVariable String sessionId,
            @RequestParam String userId) {
        try {
            if (userId == null || userId.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Result.error("User ID is required"));
            }

            List<ChatMessage> messages = chatService.getSessionMessages(sessionId, userId);
            return ResponseEntity.ok(Result.success(messages));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Result.error("Failed to get messages: " + e.getMessage()));
        }
    }

    @DeleteMapping("/sessions/{sessionId}")
    @Operation(summary = "Delete a chat session", description = "Delete a specific chat session and all its messages")
    public ResponseEntity<Result<String>> deleteSession(
            @PathVariable String sessionId,
            @RequestParam String userId) {
        try {
            if (userId == null || userId.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Result.error("User ID is required"));
            }

            chatService.deleteSession(sessionId, userId);
            return ResponseEntity.ok(Result.success("Session deleted successfully"));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Result.error("Failed to delete session: " + e.getMessage()));
        }
    }
}