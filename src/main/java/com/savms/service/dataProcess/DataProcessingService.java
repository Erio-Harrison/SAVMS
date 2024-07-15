package com.savms.service.dataProcess;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

import java.io.File;

@Service
public class DataProcessingService {

    @Value("${cpp.library.path.base}")
    private String libraryPathBase;

    @Value("${cpp.library.name.linux}")
    private String libraryNameLinux;

    @Value("${cpp.library.name.windows}")
    private String libraryNameWindows;

    @Value("${cpp.library.name.mac}")
    private String libraryNameMac;

    @PostConstruct
    public void init() {
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
        System.load(fullPath);
    }

    public native String processDataNative(String input);

    public String processData(String input) {
        return processDataNative(input);
    }
}
