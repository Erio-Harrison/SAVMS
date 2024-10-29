package com.savms.controller;

import com.savms.service.ZeroMQService;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ZeroMQController {

    private final ZeroMQService zeroMQService;

    public ZeroMQController(ZeroMQService zeroMQService) {
        this.zeroMQService = zeroMQService;
    }

}