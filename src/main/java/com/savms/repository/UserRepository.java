package com.savms.repository;

import com.savms.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * User repository class.
 * Receive and handle data from MongoDB database.
 * @author Yutong Cheng u7739713
 */
@Repository
public class UserRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * Adds a new user to the database.
     * @param user The user object to be saved.
     */
    public void addUser( User user )
    {
        mongoTemplate.save( user );
        System.out.println( "User added successfully: " + user );
    }

    /**
     * Deletes a user by their ID.
     * @param userId The ID of the user to be deleted.
     */
    public void deleteUserById(String userId)
    {
        Query query = new Query( Criteria.where("id").is(userId) );
        mongoTemplate.remove( query, User.class );
    }

    /**
     * Finds a user by their username.
     * @param username The username to search for.
     * @return An Optional containing the user if found, otherwise empty.
     */
    public Optional<User> findByUsername(String username)
    {
        Query query = new Query( Criteria.where("username").is(username) );
        return Optional.ofNullable( mongoTemplate.findOne(query, User.class) );
    }

    /**
     * Finds a user by their email.
     * @param email The email to search for.
     * @return An Optional containing the user if found, otherwise empty.
     */
    public Optional<User> findByEmail(String email)
    {
        Query query = new Query( Criteria.where( "email" ).is( email ) );
        return Optional.ofNullable( mongoTemplate.findOne( query, User.class ) );
    }

    /**
     * Updates the email address of a user.
     * @param userId The ID of the user.
     * @param newEmail The new email address to set.
     */
    public void updateEmail(String userId, String newEmail)
    {
        User user = mongoTemplate.findById( userId, User.class );
        if( user != null )
        {
            user.setEmail( newEmail );
            mongoTemplate.save( user );
        }
    }

    /**
     * Updates the password of a user.
     * @param userId The ID of the user.
     * @param newPassword The new password to set.
     */
    public void updatePassword( String userId, String newPassword )
    {
        User user = mongoTemplate.findById( userId, User.class );
        if( user != null )
        {
            user.setPassword( newPassword );
            mongoTemplate.save( user );
        }
    }

    /**
     * Retrieves all users from the database.
     * @return A list of all users.
     */
    public List<User> getAllUsers()
    {
        return mongoTemplate.findAll( User.class );
    }
}
