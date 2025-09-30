package com.savms.service;

import com.savms.dto.ChatRequest;
import com.savms.dto.ChatResponse;
import com.savms.dto.Intent;
import com.savms.dto.ExtractedInfo;
import com.savms.dto.WorkflowContext;
import com.savms.entity.ChatMessage;
import com.savms.entity.ChatSession;
import com.savms.entity.Vehicle;
import com.savms.repository.ChatMessageRepository;
import com.savms.repository.ChatSessionRepository;
import com.savms.repository.VehicleRepository;
import org.springframework.ai.chat.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ChatService {

    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);

    @Autowired
    private ChatClient chatClient;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private ChatSessionRepository chatSessionRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    public com.savms.dto.ChatResponse sendMessage(ChatRequest request) {
        try {
            // 处理工作流（前4个阶段）
            WorkflowContext context = processMessageWorkflow(request);

            // AI调用
            String aiReply = callAI(context.getMessages());

            // 保存响应
            return saveAIResponse(context, aiReply);

        } catch (Exception e) {
            logger.error("Error in sendMessage", e);
            throw new RuntimeException("Failed to process message: " + e.getMessage(), e);
        }
    }

    private ChatSession getOrCreateSession(ChatRequest request) {
        Optional<ChatSession> existingSession = chatSessionRepository
            .findByIdAndUserId(request.getSessionId(), request.getUserId());

        if (existingSession.isPresent()) {
            return existingSession.get();
        }

        ChatSession newSession = new ChatSession(
            request.getUserId(),
            "Chat " + LocalDateTime.now().toString()
        );
        newSession.setId(request.getSessionId());
        chatSessionRepository.save(newSession);
        return newSession;
    }

    private void addMessageToSession(ChatSession session, String messageId) {
        if (session.getMessageIds() == null) {
            session.setMessageIds(new ArrayList<>());
        }
        session.getMessageIds().add(messageId);
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

    private Intent recognizeIntent(String userMessage) {
        try {
            String intentPrompt = "请分析以下用户消息的意图，只返回以下选项之一：VEHICLE_INQUIRY、USER_INQUIRY、TASK_INQUIRY、GENERAL_CHAT、UNKNOWN。\n\n用户消息：" + userMessage + "\n\n只需返回意图名称，不要其他内容。";

            Prompt prompt = new Prompt(new UserMessage(intentPrompt));
            String response = chatClient.call(prompt).getResult().getOutput().getContent().trim();

            logger.info("Intent recognition result: {}", response);

            try {
                return Intent.valueOf(response);
            } catch (IllegalArgumentException e) {
                logger.warn("Unable to parse intent: {}, defaulting to UNKNOWN", response);
                return Intent.UNKNOWN;
            }
        } catch (Exception e) {
            logger.error("Error during intent recognition", e);
            return Intent.UNKNOWN;
        }
    }

    private ExtractedInfo extractInformation(String userMessage) {
        try {
            String extractionPrompt = "请从以下用户消息中提取车牌号信息。车牌号通常是字母数字组合，如ABC-123、京A12345等格式。\n" +
                "请只返回找到的车牌号，用逗号分隔。如果没有找到车牌号，请返回\"无\"。\n\n" +
                "用户消息：" + userMessage + "\n\n只返回车牌号，不要其他内容。";

            Prompt prompt = new Prompt(new UserMessage(extractionPrompt));
            String response = chatClient.call(prompt).getResult().getOutput().getContent().trim();

            logger.info("Information extraction result: {}", response);

            ExtractedInfo extractedInfo = new ExtractedInfo(userMessage);

            if (!response.equals("无") && !response.toLowerCase().contains("none") && !response.isEmpty()) {
                String[] plates = response.split("[,，]");
                List<String> vehiclePlates = new ArrayList<>();
                for (String plate : plates) {
                    String cleanPlate = plate.trim();
                    if (!cleanPlate.isEmpty()) {
                        vehiclePlates.add(cleanPlate);
                    }
                }
                extractedInfo.setVehiclePlates(vehiclePlates);
                logger.info("Extracted {} vehicle plates: {}", vehiclePlates.size(), vehiclePlates);
            }

            return extractedInfo;
        } catch (Exception e) {
            logger.error("Error during information extraction", e);
            return new ExtractedInfo(userMessage);
        }
    }

    private String retrieveKnowledge(Intent intent, ExtractedInfo extractedInfo) {
        StringBuilder knowledge = new StringBuilder();

        try {
            if (intent == Intent.VEHICLE_INQUIRY && extractedInfo.getVehiclePlates() != null) {
                for (String licensePlate : extractedInfo.getVehiclePlates()) {
                    Optional<Vehicle> vehicleOpt = vehicleRepository.findByLicensePlate(licensePlate);
                    if (vehicleOpt.isPresent()) {
                        Vehicle vehicle = vehicleOpt.get();
                        knowledge.append("车牌号 ").append(licensePlate).append(" 的车辆信息：\n");
                        knowledge.append("- 车型：").append(vehicle.getCarModel()).append("\n");
                        knowledge.append("- 年份：").append(vehicle.getYear()).append("\n");
                        knowledge.append("- 能源类型：").append(vehicle.getEnergyType()).append("\n");
                        knowledge.append("- 当前速度：").append(vehicle.getSpeed()).append(" km/h\n");
                        knowledge.append("- 剩余电量：").append(vehicle.getLeftoverEnergy()).append("%\n");
                        knowledge.append("- 连接状态：").append(vehicle.getConnectionStatus() == 1 ? "已连接" : "未连接").append("\n");
                        knowledge.append("- 任务状态：").append(vehicle.getTaskStatus() == 1 ? "执行中" : "空闲").append("\n");
                        knowledge.append("- 健康状态：").append(vehicle.getHealthStatus() == 1 ? "正常" : "异常").append("\n");
                        knowledge.append("- 当前位置：纬度 ").append(vehicle.getLatitude()).append(", 经度 ").append(vehicle.getLongitude()).append("\n\n");

                        logger.info("Found vehicle information for license plate: {}", licensePlate);
                    } else {
                        knowledge.append("车牌号 ").append(licensePlate).append(" 的车辆未在系统中找到。\n\n");
                        logger.info("No vehicle found for license plate: {}", licensePlate);
                    }
                }
            }

            logger.info("Knowledge retrieval completed, knowledge length: {}", knowledge.length());
            return knowledge.toString();

        } catch (Exception e) {
            logger.error("Error during knowledge retrieval", e);
            return "";
        }
    }

    public WorkflowContext processMessageWorkflow(ChatRequest request) {
        logger.info("Starting workflow processing for user: {}, session: {}", request.getUserId(), request.getSessionId());

        // Stage 1: Session Management
        ChatSession session = getOrCreateSession(request);

        ChatMessage userChatMessage = new ChatMessage(
            session.getId(),
            request.getUserId(),
            request.getMessage(),
            "user"
        );
        chatMessageRepository.save(userChatMessage);
        addMessageToSession(session, userChatMessage.getId());

        // Create workflow context
        WorkflowContext context = new WorkflowContext(session, userChatMessage, request.getUserId());

        // Stage 2: Intent Recognition
        logger.info("Stage 1: Recognizing intent for message: {}", request.getMessage());
        Intent intent = recognizeIntent(request.getMessage());
        logger.info("Recognized intent: {}", intent);
        context.setIntent(intent);

        // Stage 3: Information Extraction
        logger.info("Stage 2: Extracting information from message");
        ExtractedInfo extractedInfo = extractInformation(request.getMessage());
        logger.info("Extracted info: vehiclePlates={}, userIds={}, taskIds={}",
                   extractedInfo.getVehiclePlates(), extractedInfo.getUserIds(), extractedInfo.getTaskIds());
        context.setExtractedInfo(extractedInfo);

        // Stage 4: Knowledge Retrieval
        logger.info("Stage 3: Retrieving knowledge based on intent and extracted info");
        String knowledge = retrieveKnowledge(intent, extractedInfo);
        logger.info("Retrieved knowledge length: {}", knowledge.length());
        context.setKnowledge(knowledge);

        // Stage 5: Context Building
        logger.info("Stage 4: Building conversation context");
        List<ChatMessage> conversationHistory = chatMessageRepository
            .findBySessionIdOrderByTimestamp(session.getId());

        logger.info("Found {} messages in conversation history for session {}",
                   conversationHistory.size(), session.getId());

        // 构建消息列表
        List<Message> messages = new ArrayList<>();

        // 添加系统消息，包含知识信息
        StringBuilder systemPrompt = new StringBuilder();
        systemPrompt.append("你是一个智能车辆管理助手。请仔细阅读完整的对话历史，并基于之前的对话内容来回答用户的问题。");
        systemPrompt.append("如果用户询问之前提到过的信息，请准确引用和回答。");

        if (!knowledge.isEmpty()) {
            systemPrompt.append("\n\n以下是相关的车辆信息，请在回答时参考这些信息：\n");
            systemPrompt.append(knowledge);
        }

        messages.add(new SystemMessage(systemPrompt.toString()));

        // 添加历史对话消息
        for (ChatMessage msg : conversationHistory) {
            if ("user".equals(msg.getRole())) {
                messages.add(new UserMessage(msg.getContent()));
            } else if ("assistant".equals(msg.getRole())) {
                messages.add(new AssistantMessage(msg.getContent()));
            }
        }

        context.setMessages(messages);

        logger.info("Workflow processing completed: {}", context);
        return context;
    }

    private String callAI(List<Message> messages) {
        logger.info("Stage 5: Sending {} messages to AI with knowledge-enhanced context", messages.size());

        Prompt prompt = new Prompt(messages);
        String aiReply = chatClient.call(prompt).getResult().getOutput().getContent();

        logger.info("AI Reply received: {}", aiReply);
        return aiReply;
    }

    private SseEmitter callAIStream(List<Message> messages, WorkflowContext context) {
        SseEmitter emitter = new SseEmitter(300000L); // 5分钟超时

        try {
            logger.info("Stage 5: Starting streaming AI response with {} messages", messages.size());

            // 在新线程中处理流式响应
            new Thread(() -> {
                try {
                    Prompt prompt = new Prompt(messages);

                    // 由于Spring AI 0.8.1的流式API可能不可用，我们使用模拟流式传输
                    String aiReply = chatClient.call(prompt).getResult().getOutput().getContent();

                    // 模拟流式传输：按词或句子发送，更接近真实AI流式体验
                    StringBuilder fullResponse = new StringBuilder();
                    String[] words = aiReply.split(" ");

                    for (int i = 0; i < words.length; i++) {
                        String chunk = words[i];
                        if (i < words.length - 1) {
                            chunk += " "; // 添加空格，除了最后一个词
                        }

                        fullResponse.append(chunk);
                        emitter.send(SseEmitter.event()
                            .data(chunk)
                            .name("message"));

                        // 模拟AI生成速度：较短延迟
                        Thread.sleep(30 + (int)(Math.random() * 70)); // 30-100ms随机延迟
                    }

                    // 保存完整回复到数据库
                    if (fullResponse.length() > 0) {
                        saveAIResponse(context, fullResponse.toString());
                        logger.info("Streaming response saved to database");
                    }

                    // 发送完成信号
                    emitter.send(SseEmitter.event()
                        .data("[DONE]")
                        .name("done"));

                    emitter.complete();
                    logger.info("Streaming AI response completed, total length: {}", fullResponse.length());

                } catch (Exception e) {
                    logger.error("Error during streaming AI call", e);
                    try {
                        emitter.send(SseEmitter.event()
                            .data("Error: " + e.getMessage())
                            .name("error"));
                    } catch (Exception sendError) {
                        logger.error("Error sending error message", sendError);
                    }
                    emitter.completeWithError(e);
                }
            }).start();

        } catch (Exception e) {
            logger.error("Error starting streaming AI call", e);
            emitter.completeWithError(e);
        }

        return emitter;
    }

    private ChatResponse saveAIResponse(WorkflowContext context, String aiReply) {
        logger.info("Saving AI response to database");

        ChatMessage assistantMessage = new ChatMessage(
            context.getSession().getId(),
            context.getUserId(),
            aiReply,
            "assistant"
        );
        chatMessageRepository.save(assistantMessage);

        addMessageToSession(context.getSession(), assistantMessage.getId());

        context.getSession().setUpdatedAt(LocalDateTime.now());
        chatSessionRepository.save(context.getSession());

        logger.info("AI response saved successfully: messageId={}", assistantMessage.getId());

        return new ChatResponse(
            aiReply,
            context.getSession().getId(),
            assistantMessage.getId()
        );
    }

    public SseEmitter sendMessageStream(ChatRequest request) {
        try {
            // 处理工作流（前4个阶段）
            WorkflowContext context = processMessageWorkflow(request);

            // 流式AI调用
            return callAIStream(context.getMessages(), context);

        } catch (Exception e) {
            logger.error("Error in sendMessageStream", e);
            SseEmitter errorEmitter = new SseEmitter();
            try {
                errorEmitter.send(SseEmitter.event()
                    .data("Error: " + e.getMessage())
                    .name("error"));
                errorEmitter.complete();
            } catch (Exception sendError) {
                logger.error("Error sending error message", sendError);
                errorEmitter.completeWithError(sendError);
            }
            return errorEmitter;
        }
    }
}