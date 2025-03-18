package com.savms.controller;

import com.savms.entity.User;
import com.savms.service.UserrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {

    @Autowired
    private UserrService userService;

    // 创建用户
    @PostMapping("/test1")
    public void createUser(@RequestBody User user) {
        userService.saveUser(user);
    }

}
