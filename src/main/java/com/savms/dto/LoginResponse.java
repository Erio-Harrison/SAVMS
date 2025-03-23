package com.savms.dto;

/**
 * Data Transfer Object (DTO) for encapsulating login response data.
 * Used to send standardized login results to clients.
 */

public class LoginResponse {
    private String token;
    private String id;
    private String username;
    private String email;
    private String error;

    /**
     * Constructor for successful login responses.
     * @param token  Placeholder authentication token (to be replaced with JWT)
     * @param id     User's unique ID
     * @param username Authenticated username
     * @param email  User's registered email
     */
    public LoginResponse(String token, String id, String username, String email) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
    }

    /**
     * Constructor for failed login attempts.
     * @param error Description of authentication failure
     */
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