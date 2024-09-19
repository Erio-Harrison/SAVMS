package com.savms.service;

import org.springframework.stereotype.Service;
import org.zeromq.SocketType;
import org.zeromq.ZContext;
import org.zeromq.ZMQ;

import javax.annotation.PostConstruct;
import java.util.concurrent.ConcurrentLinkedQueue;

@Service
public class ZeroMQService {

    private final ZContext context;
    private final ZMQ.Socket publisher;
    private final ZMQ.Socket subscriber;
    private final ConcurrentLinkedQueue<String> receivedMessages = new ConcurrentLinkedQueue<>();

    public ZeroMQService(ZContext context) {
        this.context = context;
        this.publisher = context.createSocket(SocketType.PUB);
        this.subscriber = context.createSocket(SocketType.SUB);
        this.publisher.bind("tcp://*:5555");
        this.subscriber.connect("tcp://localhost:5556");
        this.subscriber.subscribe("".getBytes());
    }

    @PostConstruct
    public void init() {
        new Thread(this::receiveMessages).start();
    }

    public void sendMessage(String message) {
        publisher.send(message);
    }

    private void receiveMessages() {
        while (!Thread.currentThread().isInterrupted()) {
            String message = subscriber.recvStr();
            if (message != null) {
                receivedMessages.offer(message);
            }
        }
    }

    public String getNextReceivedMessage() {
        return receivedMessages.poll();
    }
}