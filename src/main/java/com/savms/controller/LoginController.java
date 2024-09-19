package com.savms.controller;

import com.savms.entity.Account;
import com.savms.service.UserService;
import com.savms.utils.Result;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * function：
 * author：lsr
 * date：2024/3/13 20:21
 */

@RestController
public class LoginController {

    @Autowired
    UserService userService;

    @GetMapping("/")
    public Result hello(){return Result.success("success");}

    @PostMapping("/login")
    public Result login(@RequestBody Account user, HttpServletResponse response){
        Result rs = userService.login(user,response);
        return rs;
    }

    @PostMapping("/register")
    public Result register(@Validated @RequestBody Account user){
        Result rs = userService.register(user);
        return rs;

    }
}
