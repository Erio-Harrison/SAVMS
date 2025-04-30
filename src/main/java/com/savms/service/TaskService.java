package com.savms.service;

import com.savms.entity.TaskNode;
import com.savms.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public void createTask(TaskNode task) {
        taskRepository.addTask(task);
    }

    public void deleteTask(String id) {
        taskRepository.deleteTaskById(id);
    }

    public Optional<TaskNode> getTaskById(String id) {
        return taskRepository.findById(id);
    }

    public List<TaskNode> getAllTasks() {
        return taskRepository.getAllTasks();
    }

    public List<TaskNode> getTasksByStatus(int status) {
        return taskRepository.findByStatus(status);
    }

    public void updateTaskStatus(String id, int status) {
        taskRepository.updateStatus(id, status);
    }

    public List<TaskNode> getTasksInTimeRange(LocalDateTime start, LocalDateTime end) {
        return taskRepository.findTasksInTimeRange(start, end);
    }

    public List<TaskNode> getTasksWithVehicleAssigned() {
        return taskRepository.findTasksWithVehicleAssigned();
    }

    public List<TaskNode> getTasksByStartLocation(String address) {
        return taskRepository.findTasksByStartLocation(address);
    }
}