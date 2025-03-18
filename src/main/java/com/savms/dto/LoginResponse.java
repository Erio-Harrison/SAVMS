package com.savms.dto;

public class LoginResponse {
    private String token;
    private String id;
    private String username;
    private String email;
    private String error;

    // 成功构造器（移除 roles）
    public LoginResponse(String token, String id, String username, String email) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
    }

    // 错误构造器
    public LoginResponse(String error) {
        this.error = error;
    }

    // Getters
    public String getToken() { return token; }
    public String getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getError() { return error; }
}