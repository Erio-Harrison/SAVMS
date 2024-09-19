package com.savms.service;

/**
 * function：
 * author：lsr
 * date：2024/3/13 19:33
 */

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.savms.entity.Account;
import com.savms.mapper.UserMapper;
import com.savms.utils.Md5Util;
import com.savms.utils.Result;
import jakarta.annotation.Resource;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;


@Service
public class UserService extends ServiceImpl<UserMapper, Account> {

    @Resource
    UserMapper userMapper;

    public Account selectByUsername(String account){
        QueryWrapper<Account> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("account",account);//条件查询器直接查username
        return  getOne(queryWrapper);
    }

    public void insertUser(Account user) {
        userMapper.insert(user);
    }

    public Result login(Account user, HttpServletResponse response) {
        Account dbUser = this.selectByUsername(user.getAccount());
        if(dbUser == null){
            return Result.error("The account doesn't exist");
        }
        if(!Md5Util.checkPassword(user.getPassword(),dbUser.getPassword())){
            return Result.error("Account or password is incorrect.");
        }else {
            addCookie(response,"username", dbUser.getAccount());
            return Result.success(dbUser);
        }
    }

    public Result register(Account account) {
        String accountStr = account.getAccount();
        Account searchUser = this.selectByUsername(accountStr);
        if (searchUser == null){
            String password = account.getPassword();
            password = Md5Util.getMD5String(password);
            account.setPassword(password);
            userMapper.insert(account);
            return Result.success(account);
        }else {
            return Result.error("The account has been exist");
        }
    }

    private void addCookie(HttpServletResponse response, String name, String value) {
        Cookie cookie = new Cookie(name, value);
        cookie.setMaxAge(7 * 24 * 60 * 60); // 设置Cookie的有效期为一周
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);
        System.out.println(cookie.toString());
    }
}
