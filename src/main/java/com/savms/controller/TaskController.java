package com.savms.controller;

import com.savms.entity.TaskNode;
import com.savms.service.TaskService;
import com.savms.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin // 如果需要跨域访问
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping("/create")
    public Result<?> createTask(@RequestBody TaskNode task) {
        taskService.createTask(task);
        return Result.success("Task created successfully");
    }

    @DeleteMapping("/delete/{id}")
    public Result<?> deleteTask(@PathVariable String id) {
        taskService.deleteTask(id);
        return Result.success("Task deleted successfully");
    }

    @GetMapping("/{id}")
    public Result<?> getTaskById(@PathVariable String id) {
        Optional<TaskNode> task = taskService.getTaskById(id);
        return task.map(Result::success).orElseGet(() -> Result.error("Task not found"));
    }

    @GetMapping("/all")
    public Result<?> getAllTasks() {
        return Result.success(taskService.getAllTasks());
    }

    @GetMapping("/status/{status}")
    public Result<?> getTasksByStatus(@PathVariable int status) {
        return Result.success(taskService.getTasksByStatus(status));
    }

    @PutMapping("/{id}/status")
    public Result<?> updateTaskStatus(@PathVariable String id, @RequestParam int status) {
        taskService.updateTaskStatus(id, status);
        return Result.success("Task status updated");
    }

    @GetMapping("/range")
    public Result<?> getTasksInTimeRange(@RequestParam String start, @RequestParam String end) {
        LocalDateTime startTime = LocalDateTime.parse(start);
        LocalDateTime endTime = LocalDateTime.parse(end);
        return Result.success(taskService.getTasksInTimeRange(startTime, endTime));
    }

    @GetMapping("/with-vehicle")
    public Result<?> getTasksWithVehicleAssigned() {
        return Result.success(taskService.getTasksWithVehicleAssigned());
    }

    @GetMapping("/start-location")
    public Result<?> getTasksByStartLocation(@RequestParam String address) {
        return Result.success(taskService.getTasksByStartLocation(address));
    }
}
