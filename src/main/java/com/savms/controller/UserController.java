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
        System.out.println("in /create");
        user.setRole(1);
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
    @GetMapping( "/getByUsername/{username}" )
    public Optional<User> getUserByUsername( @PathVariable String username )
    {
        return userService.getUserByUsername( username );
    }

    /**
     * Retrieves a user by email.
     * @param email The email to search for.
     * @return The user if found.
     */
    @GetMapping( "/getByEmail/{email}" )
    public Optional<User> getUserByEmail( @PathVariable String email )
    {
        return userService.getUserByEmail( email );
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
        System.out.println(userId);
        System.out.println(newPassword);

        userService.updateUserPassword( userId, newPassword );
    }

    /**
     * Sets a user's role.
     * @param userId The ID of the user.
     * @param role The new role (0 = admin, 1 = client).
     */
    @PutMapping("/{userId}/setRole")
    public void setUserRole(@PathVariable String userId, @RequestParam int role)
    {
        userService.setUserRole(userId, role);
    }

    /**
     * Gets a user's role by ID.
     * @param userId The ID of the user.
     * @return The user's role (0 = admin, 1 = client).
     */
    @GetMapping("/{userId}/getRole")
    public int getUserRoleById( @PathVariable String userId )
    {
        return userService.getUserRoleById( userId );
    }

    /**
     * Gets a user's role by username.
     * @param username The username of the user.
     * @return The user's role (0 = admin, 1 = client).
     */
    @GetMapping("/getRoleByUsername")
    public int getUserRoleByUsername( @RequestParam String username )
    {
        return userService.getUserRoleByUsername( username );
    }
}
