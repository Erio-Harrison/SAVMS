package com.savms.service;

import org.springframework.stereotype.Service;
import org.zeromq.SocketType;
import org.zeromq.ZContext;
import org.zeromq.ZMQ;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service
public class ZeroMQService {

    private final ZContext context;
    private final ExecutorService executorService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private volatile boolean running = true;

    public ZeroMQService(ZContext context) {
        this.context = context;
        this.executorService = Executors.newCachedThreadPool();
    }

    @PostConstruct
    public void init() {
        executorService.submit(this::acceptConnections);
    }

    private void acceptConnections() {
        try (ZMQ.Socket socket = context.createSocket(SocketType.ROUTER)) {
            socket.bind("tcp://*:5555");
            System.out.println("ZeroMQ Server started, listening on port 5555");

            while (running) {
                byte[] identity = socket.recv();
                if (identity != null) {
                    byte[] message = socket.recv();
                    // Whenever a new message is received, a new task is created to process the message and submitted to the thread pool.
                    // This allows multiple messages to be processed in parallel.
                    executorService.submit(() -> handleMessage(socket, identity, message));
                }
            }
        }
    }

    private void handleMessage(ZMQ.Socket socket, byte[] identity, byte[] message) {
        String messageStr = new String(message);
        System.out.println("Received message from " + new String(identity) + ": " + messageStr);

        // Process the message here
        // For now, we'll just echo it back
        socket.send(identity, ZMQ.SNDMORE);
        socket.send("Received: " + messageStr);
    }

    //1. Set the running flag to false to notify the main loop to stop.
    //2. Call shutdown() to start an orderly shutdown, no longer accepting new tasks, but continuing to process submitted tasks.
    //3. Wait 800 milliseconds for the task to complete.
    //4. If the task is not completed within 800 milliseconds, call shutdownNow() to force termination of all tasks.
    @PreDestroy
    public void destroy() {
        running = false;
        executorService.shutdown();
        try {
            if (!executorService.awaitTermination(800, TimeUnit.MILLISECONDS)) {
                executorService.shutdownNow();
            }
        } catch (InterruptedException e) {
            executorService.shutdownNow();
        }
        context.close();
    }
}