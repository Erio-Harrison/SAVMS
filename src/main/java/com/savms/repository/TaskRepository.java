package com.savms.repository;

import com.savms.entity.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class TaskRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    public void addTask(Task task) {
        mongoTemplate.save(task);
    }

    public void deleteTaskById(String taskId) {
        Query query = new Query(Criteria.where("id").is(taskId));
        mongoTemplate.remove(query, Task.class);
    }

    public Optional<Task> findById(String taskId) {
        return Optional.ofNullable(mongoTemplate.findById(taskId, Task.class));
    }

    public List<Task> getAllTasks() {
        return mongoTemplate.findAll(Task.class);
    }

    public void updateTaskStatus(String taskId, int status) {
        Task task = mongoTemplate.findById(taskId, Task.class);
        if (task != null) {
            task.setStatus(status);
            mongoTemplate.save(task);
        }
    }
}