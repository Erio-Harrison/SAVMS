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
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return true; // 直接放行预检请求
        }
        String path = request.getRequestURI();
        System.out.println(path);
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7); // 去掉 "Bearer "
        }
        System.out.println(token);
        boolean  b = JwtUtil.validateToken(token);
        System.out.println(b);
        if(b){
            return b;
        }
        else{
            response.setStatus(401);
            return b;
        }

    }
}
