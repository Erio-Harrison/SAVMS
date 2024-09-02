package com.savms.service;

import org.springframework.stereotype.Service;

@Service
public class DataProcessingService {

    // 声明本地方法
    public native String processDataNative(String input);

    public String processData(String input) {
        // 调用本地方法
        return processDataNative(input);
    }
}