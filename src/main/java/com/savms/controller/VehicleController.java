package com.savms.controller;

import com.savms.model.entity.Vehicle;
import com.savms.result.Result;
import com.savms.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vehicle")
public class VehicleController {
    @Autowired
    private VehicleService vehicleService;

    @PostMapping
    public Result  createVehicle(@RequestBody Vehicle vehicle) {
        vehicleService.createVehicle(vehicle);

        return Result.success();
    }
    @GetMapping("/vehicle")
    public Result getVehicle(@RequestParam(required = false) Long id) {
        Vehicle vehicle = null;
        if (id != null) {
            vehicle = vehicleService.findVehicleById(id);
        }
        if (vehicle == null) {
            return Result.error("Vehicle not found");
        }
        return Result.success(vehicle);
    }
    @RequestMapping()
    public Result updateVehicle( @RequestBody Vehicle vehicle) {
        vehicleService.updateVehicle(vehicle);

        return Result.success();
    }
    //以query 类型传递id参数
    @DeleteMapping
    public Result deleteVehicle(Long id){
        vehicleService.deleteByid(id);
        return Result.success();
    }




}
