package com.savms.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
    @NotBlank(message = "Password can not be blank")
    @Size(min = 8, max = 20, message = "The length of password must between 8 and 20")
    private String password;

    @TableField("account")
    @NotBlank(message = "Account can not be blank")
    @Size(min = 8, max = 20, message = "The length of account must between 8 and 20")
    private String account;

    @TableField("nickname")
    private String nickname;

    @TableField("userimg")
    private String userimg;

    @TableField("email")
    private String email;

    @TableField("role")
    private Integer role;
}
