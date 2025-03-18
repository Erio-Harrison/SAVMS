package com.savms.controller;

import com.savms.entity.User;
import com.savms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * User controller class.
 * Receive and handle data from user service.
 * @author Yutong Cheng u7739713
 */
@RestController
@RequestMapping("/users")
public class UserController
{

    @Autowired
    private UserService userService;

    /**
     * Creates a new user.
     * @param user The user to be created.
     */
    @PostMapping("/create")
    public void createUser( @RequestBody User user )
    {
        userService.saveUser(user);
    }

    /**
     * Deletes a user by ID.
     * @param userId The ID of the user to delete.
     */
    @DeleteMapping("/delete/{userId}")
    public void deleteUser( @PathVariable String userId )
    {
        userService.deleteUser(userId);
    }

    /**
     * Retrieves a user by username.
     * @param username The username to search for.
     * @return The user if found.
     */
    @GetMapping("/get/{username}")
    public Optional<User> getUserByUsername( @PathVariable String username )
    {
        return userService.getUserByUsername(username);
    }

    /**
     * Retrieves a user by email.
     * @param email The email to search for.
     * @return The user if found.
     */
    @GetMapping("/get/{email}")
    public Optional<User> getUserByEmail( @PathVariable String email )
    {
        return userService.getUserByEmail(email);
    }

    /**
     * Retrieves all users.
     * @return A list of all users.
     */
    @GetMapping("/get/all")
    public List<User> getAllUsers()
    {
        return userService.getAllUsers();
    }

    /**
     * Updates a user's email.
     * @param userId The ID of the user.
     * @param newEmail The new email address.
     */
    @PutMapping("/{userId}/updateEmail")
    public void updateUserEmail( @PathVariable String userId, @RequestParam String newEmail )
    {
        userService.updateUserEmail( userId, newEmail );
    }

    /**
     * Updates a user's password.
     * @param userId The ID of the user.
     * @param newPassword The new password.
     */
    @PutMapping("/{userId}/updatePassword")
    public void updateUserPassword( @PathVariable String userId, @RequestParam String newPassword )
    {
        userService.updateUserEmail( userId, newPassword );
    }
}
