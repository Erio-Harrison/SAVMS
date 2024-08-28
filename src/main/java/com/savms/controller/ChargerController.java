package com.savms.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.savms.entity.Charger;
import com.savms.service.ChargerService;
import com.savms.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Author: Surui Liu
 * Date: 2024/8/23
 * Description: charger controller layer
 */

@RestController
@RequestMapping("/charger")
public class ChargerController {

    @Autowired
    ChargerService chargerService;


    @GetMapping("/selectAll")
    public Result selectAll(){
        List<Charger> chargerList = chargerService.list(new QueryWrapper<Charger>().orderByAsc("id"));
        return Result.success(chargerList);
    }

    @PostMapping("/add")
    public Result add(@RequestBody Charger charger){
        try {
            chargerService.save(charger);
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
    public Result update(@RequestBody Charger charger){
        chargerService.updateById(charger);
        return Result.success();
    }

    @DeleteMapping("/delete/{id}")
    public Result delete(@PathVariable Integer id){
        chargerService.removeById(id);
        return Result.success();
    }


}
