/*
package com.savms;


import com.savms.entity.User;
import com.savms.service.UserServiceMongoDB;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class MongoDbConnectionTest implements CommandLineRunner {

    private final UserServiceMongoDB userService;

    @Autowired
    public MongoDbConnectionTest(UserServiceMongoDB userService) {
        this.userService = userService;
    }

    @Override
    public void run(String... args) {
        // Create a test user
        User testUser = userService.createUser("TestUser", "test@example.com");
        System.out.println("Test user created: " + testUser);

        // Retrieve the user
        User foundUser = userService.findUserByEmail("test@example.com");
        System.out.println("Found user: " + foundUser);
    }
}
*/