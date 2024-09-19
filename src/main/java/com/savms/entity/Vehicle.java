package com.savms.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import java.io.Serializable;
import java.util.Date;
@Data
@TableName("user")
public class Vehicle implements Serializable {

    @TableId(type = IdType.AUTO)
    @TableField(value = "id")
    private Long id;

    @TableField(value = "registration_number")
    private String registrationNumber;

    @TableField(value = "registration_date")
    private Date registrationDate;

    @TableField(value = "battery_level")
    private Float batteryLevel;

    @TableField(value = "current_location")
    private String currentLocation;

    @TableField(value = "status")
    private Integer status;

    @TableField(value = "vehicle_damage")
    private String vehicleDamage;

    @TableField(value = "last_update")
    private Date lastUpdate;

    @TableField(value = "model")
    private String model;

    @TableField(value = "manufacturer")
    private String manufacturer;

}
