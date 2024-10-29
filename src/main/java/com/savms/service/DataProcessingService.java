package com.savms.service;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.File;

@Service
public class DataProcessingService {
    private static final Logger logger = LoggerFactory.getLogger(DataProcessingService.class);

    @Value("${cpp.library.path.base}")
    private String libraryPathBase;

    @Value("${cpp.library.name.linux}")
    private String libraryNameLinux;

    @Value("${cpp.library.name.windows}")
    private String libraryNameWindows;

    @Value("${cpp.library.name.mac}")
    private String libraryNameMac;

    // 移除构造函数中的初始化调用
    public DataProcessingService() {
    }

    // 使用 @PostConstruct 注解，确保属性注入完成后再初始化
    @PostConstruct
    private void initializeNativeLibrary() {
        try {
            logger.info("Current working directory: {}", System.getProperty("user.dir"));
            logger.info("Library path base: {}", libraryPathBase);

            // 根据操作系统选择库文件名
            String libraryName;
            String osName = System.getProperty("os.name").toLowerCase();
            if (osName.contains("win")) {
                libraryName = libraryNameWindows;
            } else if (osName.contains("mac")) {
                libraryName = libraryNameMac;
            } else {
                libraryName = libraryNameLinux;
            }

            // 构建完整的库文件路径
            File libraryPath = new File(libraryPathBase);
            if (!libraryPath.exists()) {
                throw new RuntimeException("Library path does not exist: " + libraryPathBase);
            }

            File libraryFile = new File(libraryPath, libraryName);
            if (!libraryFile.exists()) {
                throw new RuntimeException("Library file does not exist: " + libraryFile.getAbsolutePath());
            }

            logger.info("Loading library from: {}", libraryFile.getAbsolutePath());
            System.load(libraryFile.getAbsolutePath());
            logger.info("Successfully loaded native library: {}", libraryName);

        } catch (Exception e) {
            logger.error("Failed to load native library", e);
            logger.error("java.library.path: {}", System.getProperty("java.library.path"));
            throw new RuntimeException("Failed to load native library", e);
        }
    }

    private native String processDataNative(String input);

    public String processData(String source) {
        logger.info("Processing data from source: {}", source);
        try {
            String result = processDataNative(source);
            logger.info("Data processing completed successfully");
            return result;
        } catch (Exception e) {
            logger.error("Error processing data", e);
            throw e;
        }
    }
}