package com.savms.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.savms.entity.VehicleUnused;
import com.savms.service.VehicleService;
import com.savms.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Author: Surui Liu
 * Date: 2024/8/23
 * Description: vehicle controller layer
 */

@RestController
@RequestMapping("/vehicle")
public class VehicleController {
    @Autowired
    VehicleService vehicleService;


    @GetMapping("/selectAll")
    public Result selectAll(){
        List<VehicleUnused> activityList = vehicleService.list(new QueryWrapper<VehicleUnused>().orderByAsc("id"));
        return Result.success(activityList);
    }

    @PostMapping("/add")
    public Result add(@RequestBody VehicleUnused vehicleUnused){
        try {
            vehicleService.save(vehicleUnused);
        } catch (Exception e) {
            if(e instanceof DuplicateKeyException) {
                return Result.error("插入数据库错误");
            } else {
                return Result.error("系统错误");
            }
        }
        return Result.success();
    }

    @PutMapping("/update")
    public Result update(@RequestBody VehicleUnused vehicleUnused){
        vehicleService.updateById(vehicleUnused);
        return Result.success();
    }

    @DeleteMapping("/delete/{id}")
    public Result delete(@PathVariable Long id){
        vehicleService.removeById(id);
        return Result.success();
    }

}
