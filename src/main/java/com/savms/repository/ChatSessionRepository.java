package com.savms.repository;

import com.savms.entity.ChatSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Chat session repository class.
 * Handles chat session data operations with MongoDB database.
 */
@Repository
public class ChatSessionRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * Saves a chat session to the database.
     * @param chatSession The chat session to be saved.
     */
    public void save(ChatSession chatSession) {
        mongoTemplate.save(chatSession);
    }

    /**
     * Finds all chat sessions for a user, ordered by updated date descending.
     * @param userId The user ID.
     * @return List of chat sessions.
     */
    public List<ChatSession> findByUserIdOrderByUpdatedAtDesc(String userId) {
        Query query = new Query(Criteria.where("userId").is(userId))
                .with(Sort.by(Sort.Direction.DESC, "updatedAt"));
        return mongoTemplate.find(query, ChatSession.class);
    }

    /**
     * Finds active chat sessions for a user.
     * @param userId The user ID.
     * @param active The active status.
     * @return List of chat sessions.
     */
    public List<ChatSession> findByUserIdAndActive(String userId, boolean active) {
        Query query = new Query(Criteria.where("userId").is(userId).and("active").is(active))
                .with(Sort.by(Sort.Direction.DESC, "updatedAt"));
        return mongoTemplate.find(query, ChatSession.class);
    }

    /**
     * Finds a chat session by ID and user ID.
     * @param id The session ID.
     * @param userId The user ID.
     * @return Optional containing the chat session if found.
     */
    public Optional<ChatSession> findByIdAndUserId(String id, String userId) {
        Query query = new Query(Criteria.where("id").is(id).and("userId").is(userId));
        return Optional.ofNullable(mongoTemplate.findOne(query, ChatSession.class));
    }

    /**
     * Finds chat sessions by user ID within a date range.
     * @param userId The user ID.
     * @param startDate The start date.
     * @param endDate The end date.
     * @return List of chat sessions.
     */
    public List<ChatSession> findByUserIdAndCreatedAtBetween(String userId, LocalDateTime startDate, LocalDateTime endDate) {
        Query query = new Query(Criteria.where("userId").is(userId)
                .and("createdAt").gte(startDate).lte(endDate));
        return mongoTemplate.find(query, ChatSession.class);
    }

    /**
     * Deletes a chat session by ID and user ID.
     * @param id The session ID.
     * @param userId The user ID.
     */
    public void deleteByIdAndUserId(String id, String userId) {
        Query query = new Query(Criteria.where("id").is(id).and("userId").is(userId));
        mongoTemplate.remove(query, ChatSession.class);
    }

    /**
     * Counts chat sessions by user ID and active status.
     * @param userId The user ID.
     * @param active The active status.
     * @return The count of matching sessions.
     */
    public long countByUserIdAndActive(String userId, boolean active) {
        Query query = new Query(Criteria.where("userId").is(userId).and("active").is(active));
        return mongoTemplate.count(query, ChatSession.class);
    }

    /**
     * Updates the session's updated timestamp.
     * @param sessionId The session ID.
     */
    public void updateTimestamp(String sessionId) {
        ChatSession session = mongoTemplate.findById(sessionId, ChatSession.class);
        if (session != null) {
            session.setUpdatedAt(LocalDateTime.now());
            mongoTemplate.save(session);
        }
    }
}