package com.savms.controller;

import com.savms.service.ZeroMQService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ZeroMQController {

    private final ZeroMQService zeroMQService;

    public ZeroMQController(ZeroMQService zeroMQService) {
        this.zeroMQService = zeroMQService;
    }

    @PostMapping("/send")
    public String sendMessage(@RequestBody String message) {
        zeroMQService.sendMessage(message);
        return "Message sent: " + message;
    }

    @GetMapping("/receive")
    public String receiveMessage() {
        String message = zeroMQService.getNextReceivedMessage();
        return message != null ? "Received message: " + message : "No new messages";
    }
}