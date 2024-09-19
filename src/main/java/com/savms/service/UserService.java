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
import jakarta.annotation.Resource;
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

    public Account login(Account user) {
        Account dbUser = selectByUsername(user.getAccount());
        if(dbUser == null){
            throw new ServiceException("账号不存在");
        }
        if(!user.getPassword().equals(dbUser.getPassword())){
            throw new ServiceException("用户名或密码错误");
        }
        return dbUser;
    }

    public Account register(Account account) {
        Account dbUser = selectByUsername(account.getAccount());
        if(dbUser != null){
            throw new ServiceException("账号已存在");
        }
        account.setAccount(account.getAccount());
        userMapper.insert(account);
        return account;
    }
}
