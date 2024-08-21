package com.savms.controller;

import com.savms.model.entity.Charger;
import com.savms.model.entity.Vehicle;
import com.savms.result.Result;
import com.savms.service.ChargeStationService;
import com.savms.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chargeStation")
public class chargeStationController {
    @Autowired
    private ChargeStationService chargeStationService;

    @PostMapping
    public Result createVehicle(@RequestBody Charger charger) {
        chargeStationService.createStationService(charger);
        return Result.success();
    }

    @GetMapping("/charger")
    public Result getChargeStation(@RequestParam(required = false) Long id) {
        Charger charger = null;
        if (id != null) {
            charger= chargeStationService.findStationById(id);
        }
        if (charger == null) {
            return Result.error("Vehicle not found");
        }
        return Result.success(charger);
    }
    @RequestMapping()
    public Result updateChargeStation( @RequestBody Charger charger) {
        chargeStationService.updateStation(charger);

        return Result.success();
    }
    @DeleteMapping
    public Result deleteChargeStation(Long id){
        chargeStationService.deleteByid(id);
        return Result.success();
    }

}
