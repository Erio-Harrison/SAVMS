package com.savms.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.savms.entity.Vehicle;
import com.savms.mapper.VehicleMapper;
import org.springframework.stereotype.Service;

/**
 * Author: Surui Liu
 * Date: 2024/8/23
 * Description: vehicle service
 */

@Service
public class VehicleService extends ServiceImpl<VehicleMapper, Vehicle> {
}
