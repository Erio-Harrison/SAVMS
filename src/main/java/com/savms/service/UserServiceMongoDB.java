/*
package com.savms.service;

import com.savms.entity.User;
import com.savms.mapper.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceMongoDB {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceMongoDB(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(String username, String email) {
        User user = new User(username, email);
        return userRepository.save(user);
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
*/