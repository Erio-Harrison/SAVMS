package com.savms.repository;

import com.savms.entity.ChatMessage;
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
 * Chat message repository class.
 * Handles chat message data operations with MongoDB database.
 */
@Repository
public class ChatMessageRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * Saves a chat message to the database.
     * @param chatMessage The chat message to be saved.
     */
    public void save(ChatMessage chatMessage) {
        mongoTemplate.save(chatMessage);
    }

    /**
     * Finds all messages for a session, ordered by timestamp ascending.
     * @param sessionId The session ID.
     * @return List of chat messages.
     */
    public List<ChatMessage> findBySessionIdOrderByTimestamp(String sessionId) {
        Query query = new Query(Criteria.where("sessionId").is(sessionId))
                .with(Sort.by(Sort.Direction.ASC, "timestamp"));
        return mongoTemplate.find(query, ChatMessage.class);
    }

    /**
     * Finds messages for a session with pagination.
     * @param sessionId The session ID.
     * @param limit The maximum number of messages to return.
     * @param offset The number of messages to skip.
     * @return List of chat messages.
     */
    public List<ChatMessage> findBySessionIdWithPagination(String sessionId, int limit, int offset) {
        Query query = new Query(Criteria.where("sessionId").is(sessionId))
                .with(Sort.by(Sort.Direction.ASC, "timestamp"))
                .skip(offset)
                .limit(limit);
        return mongoTemplate.find(query, ChatMessage.class);
    }

    /**
     * Finds a message by ID.
     * @param id The message ID.
     * @return Optional containing the message if found.
     */
    public Optional<ChatMessage> findById(String id) {
        return Optional.ofNullable(mongoTemplate.findById(id, ChatMessage.class));
    }

    /**
     * Finds messages by user ID within a date range.
     * @param userId The user ID.
     * @param startDate The start date.
     * @param endDate The end date.
     * @return List of chat messages.
     */
    public List<ChatMessage> findByUserIdAndTimestampBetween(String userId, LocalDateTime startDate, LocalDateTime endDate) {
        Query query = new Query(Criteria.where("userId").is(userId)
                .and("timestamp").gte(startDate).lte(endDate))
                .with(Sort.by(Sort.Direction.ASC, "timestamp"));
        return mongoTemplate.find(query, ChatMessage.class);
    }

    /**
     * Deletes all messages for a session.
     * @param sessionId The session ID.
     */
    public void deleteBySessionId(String sessionId) {
        Query query = new Query(Criteria.where("sessionId").is(sessionId));
        mongoTemplate.remove(query, ChatMessage.class);
    }

    /**
     * Deletes a specific message by ID and user ID.
     * @param id The message ID.
     * @param userId The user ID.
     */
    public void deleteByIdAndUserId(String id, String userId) {
        Query query = new Query(Criteria.where("id").is(id).and("userId").is(userId));
        mongoTemplate.remove(query, ChatMessage.class);
    }

    /**
     * Counts messages in a session.
     * @param sessionId The session ID.
     * @return The count of messages.
     */
    public long countBySessionId(String sessionId) {
        Query query = new Query(Criteria.where("sessionId").is(sessionId));
        return mongoTemplate.count(query, ChatMessage.class);
    }

    /**
     * Finds the latest message in a session.
     * @param sessionId The session ID.
     * @return Optional containing the latest message if found.
     */
    public Optional<ChatMessage> findLatestBySessionId(String sessionId) {
        Query query = new Query(Criteria.where("sessionId").is(sessionId))
                .with(Sort.by(Sort.Direction.DESC, "timestamp"))
                .limit(1);
        return Optional.ofNullable(mongoTemplate.findOne(query, ChatMessage.class));
    }
}