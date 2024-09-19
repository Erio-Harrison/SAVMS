package com.savms.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@TableName("maintenance_history")
public class MaintenanceHistory {
    @TableField("id")
    private Long id;

    @TableField("user_id")
    private Long userId;

    @TableField("date")
    private Date date;

    @TableField("description")
    private String description;
}
