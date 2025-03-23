package com.savms.service;

import com.savms.repository.UserRepository;
import com.savms.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * User service class.
 * Receive and handle data from user repository.
 * @author Yutong Cheng u7739713
 */
@Service
public class UserService
{

    @Autowired
    private UserRepository userRepository;

    /**
     * Saves a new user.
     * @param user The user to be saved.
     */
    public void saveUser( User user )
    {
        userRepository.addUser( user );
    }

    /**
     * Deletes a user by their ID.
     * @param userId The ID of the user to be deleted.
     */
    public void deleteUser( String userId )
    {
        userRepository.deleteUserById(userId);
    }

    /**
     * Finds a user by username.
     * @param username The username to search for.
     * @return An Optional containing the user if found.
     */
    public Optional<User> getUserByUsername( String username )
    {
        return userRepository.findByUsername( username );
    }

    /**
     * Finds a user by email.
     * @param email The email to search for.
     * @return An Optional containing the user if found.
     */
    public Optional<User> getUserByEmail( String email )
    {
        return userRepository.findByEmail( email );
    }

    /**
     * Updates a user's email.
     * @param userId The ID of the user.
     * @param newEmail The new email address.
     */
    public void updateUserEmail( String userId, String newEmail )
    {
        userRepository.updateEmail( userId, newEmail );
    }

    /**
     * Updates a user's password.
     * @param userId The ID of the user.
     * @param newPassword The new email address.
     */
    public void updateUserPassword( String userId, String newPassword )
    {
        userRepository.updateEmail( userId, newPassword );
    }

    /**
     * Retrieves all users from the database.
     * @return A list of all users.
     */
    public List<User> getAllUsers()
    {
        return userRepository.getAllUsers();
    }
}
