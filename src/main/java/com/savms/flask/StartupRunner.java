package com.savms.flask;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class StartupRunner {

    private final VehicleDataFetcher fetcher;

    public StartupRunner(VehicleDataFetcher fetcher) {
        this.fetcher = fetcher;
    }

    @PostConstruct
    public void init() {
        Thread thread = new Thread(fetcher);
        thread.setDaemon(true); // 可选，设置为守护线程
        thread.start();
        System.out.println("VehicleDataFetcher 启动线程已开始");
    }
}
