package com.savms;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@MapperScan("com.savms.mapper")
@EnableMongoRepositories(basePackages = "com.savms.entity")
public class ApplicationSAVMS {
    public static void main(String[] args) {
        SpringApplication.run(ApplicationSAVMS.class, args);
    }
}
