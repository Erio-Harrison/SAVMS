package com.savms.controller;

import com.savms.entity.TaskNode;
import com.savms.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin // 如果需要跨域访问
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping("/{id}")
    public Optional<TaskNode> getTaskById(@PathVariable String id) {
        return taskService.getTaskById(id);
    }

    @GetMapping("/status/{status}")
    public List<TaskNode> getTasksByStatus(@PathVariable int status) {
        System.out.println("test" + status);
        return taskService.getTasksByStatus(status);
    }
}
