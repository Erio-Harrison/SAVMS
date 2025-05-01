package com.savms.controller;

import com.savms.entity.TaskNode;
import com.savms.service.TaskService;
import com.savms.utils.Result;
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
    public Result<?> getTaskById(@PathVariable String id) {
        return Result.success(taskService.getTaskById(id));
    }

    @GetMapping("/status/{status}")
    public Result<?> getTasksByStatus(@PathVariable int status) {
        return Result.success(taskService.getTasksByStatus(status));
    }
}
