package com.savms.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@TableName("account")
public class Account {
    @TableId(type = IdType.AUTO)
    @TableField("id")
    private Long id;

    @TableField("password")
    private String password;

    @TableField("account")
    private String account;

    @TableField("role")
    private Integer role;
}
