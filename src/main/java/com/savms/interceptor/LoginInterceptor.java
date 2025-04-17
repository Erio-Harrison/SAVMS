package com.savms.interceptor;

import com.savms.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Map;
@Component
public class LoginInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception{

        String token = request.getHeader("Authorization");
        System.out.println("in");
        boolean  b = JwtUtil.validateToken(token);
        if(b){
            return b;
        }
        else{
            response.setStatus(401);
            return b;
        }

    }
}
