package com.savms.entity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.util.List;

// 继承 MongoRepository<T, ID>
@Component
public class UserRepository{

    @Autowired
    private MongoTemplate mongoTemplate;

    public void addStudent(User stu){
        System.out.println("added success");

        mongoTemplate.save(stu);

    }

//    public void update(Student stu){
//        mongoTemplate.update(stu);
//    }

}
