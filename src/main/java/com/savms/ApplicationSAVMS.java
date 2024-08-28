package com.savms;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.savms.mapper")
public class ApplicationSAVMS {
    public static void main(String[] args) {
        SpringApplication.run(ApplicationSAVMS.class, args);
    }
}
