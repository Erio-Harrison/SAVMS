package com.savms.service;

import com.savms.entity.TaskNode;
import com.savms.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public Optional<TaskNode> getTaskById(String id) {
        return taskRepository.findById(id);
    }

    public List<TaskNode> getTasksByStatus(int status) {
        return taskRepository.findByStatus(status);
    }
}