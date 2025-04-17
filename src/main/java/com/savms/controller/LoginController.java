package com.savms.controller;

import com.savms.dto.LoginRequest;
import com.savms.dto.LoginResponse;
import com.savms.security.JwtUtil;
import com.savms.dto.LoginResponse;
import com.savms.entity.User;
import com.savms.service.UserService;
import com.savms.utils.Result;
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

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public Result login(@RequestBody LoginRequest loginRequest) {
        try {
            // 1. Query user by username from the database
            User user = userService.getUserByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // 2. Validate password
            if (!user.getPassword().equals(loginRequest.getPassword())) {
                throw new RuntimeException("Wrong password");
            }

            // 3.  Build login response (token is a placeholder for future JWT implementation)
//            return ResponseEntity.ok(new LoginResponse(
//                    "dummy-token", //
//                    user.getId(),
//                    user.getUsername(),
//                    user.getEmail()
//            ));

            // 3. Create a JWT token
            String token = jwtUtil.generateToken(user.getId(), user.getUsername());


            // 4. Build LoginResponse and return
            LoginResponse loginResponse = new LoginResponse(
                    token,
                    user.getId(),
                    user.getUsername(),
                    user.getEmail()
            );

            return Result.success(loginResponse);

        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body(new LoginResponse("Login failed: " + e.getMessage()));
            return Result.error("Login failed: " + e.getMessage());
        }
    }
}