package com.savms.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.savms.entity.Vehicle;
import org.apache.ibatis.annotations.Mapper;

/**
 * Author: Surui Liu
 * Date: 2024/8/23
 * Description: Vehicle ORM
 */

@Mapper
public interface VehicleMapper extends BaseMapper<Vehicle> {
}
