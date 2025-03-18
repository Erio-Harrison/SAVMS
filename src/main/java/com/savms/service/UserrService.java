package com.savms.service;

import com.savms.entity.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import com.savms.entity.User;

@Service
public class UserrService {

    @Autowired
    private UserRepository userRepository;


    // 添加用户
    public void saveUser(User user) {
        userRepository.addStudent(user);
    }

}

