package com.savms.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;
import java.io.File;

@Configuration
public class LibraryLoaderConfig {

    @Value("${cpp.library.path.base}")
    private String libraryPathBase;

    @Value("${cpp.library.name.linux}")
    private String libraryNameLinux;

    @Value("${cpp.library.name.windows}")
    private String libraryNameWindows;

    @Value("${cpp.library.name.mac}")
    private String libraryNameMac;

    @PostConstruct
    public void loadLibrary() {
        String osName = System.getProperty("os.name").toLowerCase();
        String libraryName;

        if (osName.contains("win")) {
            libraryName = libraryNameWindows;
        } else if (osName.contains("mac")) {
            libraryName = libraryNameMac;
        } else {
            libraryName = libraryNameLinux;
        }

        String fullPath = new File(libraryPathBase, libraryName).getAbsolutePath();

        try {
            System.load(fullPath);
            System.out.println("Successfully loaded native library: " + fullPath);
        } catch (UnsatisfiedLinkError e) {
            System.err.println("Failed to load native library: " + fullPath);
            e.printStackTrace();
            // 可以选择在这里抛出一个运行时异常，或者采取其他错误处理措施
        }
    }
}