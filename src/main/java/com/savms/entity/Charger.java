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
@TableName("charger")
public class Charger {

    @TableId(type = IdType.AUTO)
    @TableField(value = "id")
    private Long id;

    @TableField(value = "station_id")
    private Long stationId;

    @TableField(value = "name")
    private String name;

    @TableField(value = "location")
    private String location;

    @TableField(value = "type")
    private Integer type;

    @TableField(value = "max_power")
    private Float maxPower;

    @TableField(value = "connector_type")
    private Integer connectorType;

}
