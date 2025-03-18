package com.savms.controller;

import com.savms.dto.LoginRequest;
import com.savms.dto.LoginResponse;
import com.savms.entity.User;
import com.savms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            // 1. 通过用户名查询用户
            User user = userService.getUserByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("用户不存在"));

            // 2. 验证密码（明文比对）
            if (!user.getPassword().equals(loginRequest.getPassword())) {
                throw new RuntimeException("密码错误");
            }

            // 3. 构建响应（无 token 和 roles）
            return ResponseEntity.ok(new LoginResponse(
                    "dummy-token", // 占位符
                    user.getId(),
                    user.getUsername(),
                    user.getEmail()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse("登录失败: " + e.getMessage()));
        }
    }
}