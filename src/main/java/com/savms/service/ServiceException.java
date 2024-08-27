package com.savms.service;

/**
 * function：
 * author：lsr
 * date：2024/3/13 20:39
 */
public class ServiceException extends RuntimeException{

    public ServiceException(String msg){
        super(msg);
    }
}
