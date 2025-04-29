package com.savms.controller;

import com.savms.dto.TaskDTO;
import com.savms.entity.Task;
import com.savms.service.TaskService;
import com.savms.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping("/create")
    public void createTask(@RequestBody Task task) {
        taskService.saveTask(task);
    }

    @DeleteMapping("/delete/{taskId}")
    public void deleteTask(@PathVariable String taskId) {
        taskService.deleteTask(taskId);
    }

    @GetMapping("/get/{taskId}")
    public Optional<Task> getTaskById(@PathVariable String taskId) {
        return taskService.getTaskById(taskId);
    }

    @GetMapping("/get/all")
    public Result getAllTasks() {
        return Result.success(taskService.getAllTaskDTOs());
    }

    @PutMapping("/{taskId}/updateStatus")
    public void updateTaskStatus(@PathVariable String taskId, @RequestParam int status) {
        taskService.updateTaskStatus(taskId, status);
    }
}