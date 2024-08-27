package com.savms.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.savms.entity.Account;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<Account> {



}
