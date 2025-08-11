package com.savms.dto;

public class LoginRequest {
    private String username;
    private String password;
    private int role; // 0 = admin, 1 = client

    public int getRole() {
        return role;
    }

    public void setRole(int role) {
        this.role = role;
    }

    // Getters & Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}