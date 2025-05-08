package com.savms.repository;

import com.savms.entity.TaskNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Task repository class.
 * Handles task-related data from MongoDB.
 * @author Yifeng Wei
 */
@Repository
public class TaskRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * Adds a new task to the database.
     * @param task The task object to be saved.
     */
    public void addTask(TaskNode task) {
        mongoTemplate.save(task);
        System.out.println("Task added successfully: " + task);
    }

    /**
     * Deletes a task by its ID.
     * @param taskId The ID of the task to be deleted.
     */
    public void deleteTaskById(String taskId) {
        Query query = new Query(Criteria.where("id").is(taskId));
        mongoTemplate.remove(query, TaskNode.class);
    }

    /**
     * Finds a task by its ID.
     * @param taskId The ID of the task.
     * @return An Optional containing the task if found, otherwise empty.
     */
    public Optional<TaskNode> findById(String taskId) {
        Query query = new Query(Criteria.where("id").is(taskId));
        return Optional.ofNullable(mongoTemplate.findOne(query, TaskNode.class));
    }

    /**
     * Finds tasks by status.
     * @param status The status of the task to search for.
     * @return A list of tasks that match the given status.
     */
    public List<TaskNode> findByStatus(int status) {
        Query query = new Query(Criteria.where("status").is(status));
        return mongoTemplate.find(query, TaskNode.class);
    }

    public List<TaskNode> getAllTasks() {
        List<TaskNode> tasks = mongoTemplate.findAll(TaskNode.class);
        return tasks;
    }

    /**
     * Updates the status of a task.
     * @param taskId The ID of the task.
     * @param newStatus The new status to set.
     */
    public void updateStatus(String taskId, int newStatus) {
        TaskNode task = mongoTemplate.findById(taskId, TaskNode.class);
        if (task != null) {
            task.setStatus(newStatus);
            mongoTemplate.save(task);
        }
    }

    /**
     * Retrieves tasks that are within a specified time range.
     * @param start The start time of the range.
     * @param end The end time of the range.
     * @return A list of tasks that fall within the given time range.
     */
    public List<TaskNode> findTasksInTimeRange(LocalDateTime start, LocalDateTime end) {
        Query query = new Query();
        query.addCriteria(Criteria.where("startTime").gte(start).lte(end));
        return mongoTemplate.find(query, TaskNode.class);
    }

    /**
     * Retrieves tasks that have a vehicle assigned.
     * @return A list of tasks that have a vehicle assigned.
     */
    public List<TaskNode> findTasksWithVehicleAssigned() {
        Query query = new Query(Criteria.where("vehicle").exists(true));
        return mongoTemplate.find(query, TaskNode.class);
    }

    /**
     * Retrieves tasks with a specific start location.
     * @param startLocation The start location to search for.
     * @return A list of tasks that match the given start location.
     */
    public List<TaskNode> findTasksByStartLocation(String startLocation) {
        Query query = new Query(Criteria.where("startLocation").is(startLocation));
        return mongoTemplate.find(query, TaskNode.class);
    }
}
