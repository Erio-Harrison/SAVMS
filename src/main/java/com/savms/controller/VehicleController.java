package com.savms.controller;

import com.savms.entity.Vehicle;
import com.savms.service.VehicleService;
import com.savms.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Vehicle controller class.
 * Receives and handles data from the vehicle service.
 * Author: Yutong Cheng u7739713
 */
@RestController
@RequestMapping("/vehicles")
public class VehicleController {
    @Autowired
    private VehicleService vehicleService;

    /**
     * Creates a new vehicle.
     * @param vehicle The vehicle to be created.
     */
    @PostMapping("/create")
    public void createVehicle(@RequestBody Vehicle vehicle) {
        vehicleService.saveVehicle(vehicle);
    }

    /**
     * Deletes a vehicle by ID.
     * @param vehicleId The ID of the vehicle to delete.
     */
    @DeleteMapping("/delete/{vehicleId}")
    public void deleteVehicle(@PathVariable String vehicleId) {
        vehicleService.deleteVehicle(vehicleId);
    }

    /**
     * Retrieves a vehicle by license plate.
     * @param licensePlate The license plate to search for.
     * @return The vehicle if found.
     */
    @GetMapping("/get/license/{licensePlate}")
    public Optional<Vehicle> getVehicleByLicensePlate(@PathVariable String licensePlate) {
        return vehicleService.getVehicleByLicensePlate(licensePlate);
    }

    /**
     * Retrieves a vehicle by vehicle ID.
     * @param vehicleId The vehicle ID to search for.
     * @return The vehicle if found.
     */
    @GetMapping("/get/id/{vehicleId}")
    public Optional<Vehicle> getVehicleByVehicleId(@PathVariable String vehicleId) {
        return vehicleService.getVehicleByVehicleId(vehicleId);
    }

    /**
     * Retrieves all vehicles.
     * @return A list of all vehicles.
     */
    @GetMapping("/get/all")
    public Result getAllVehicles() {


        return Result.success( vehicleService.getAllVehicles());
    }

    /**
     * Updates a vehicle's connection status.
     * @param vehicleId The ID of the vehicle.
     * @param newStatus The new connection status (0 or 1).
     */
    @PutMapping("/{vehicleId}/updateConnectionStatus")
    public void updateVehicleConnectionStatus(@PathVariable String vehicleId, @RequestParam int newStatus) {
        vehicleService.updateVehicleConnectionStatus(vehicleId, newStatus);
    }

    /**
     * 根据地图可视区域查询车辆
     * 接口路径：/vehicles/withinRange
     *
     * @param minLat 南侧纬度
     * @param maxLat 北侧纬度
     * @param minLng 西侧经度
     * @param maxLng 东侧经度
     * @return 指定范围内的车辆列表
     */
    @GetMapping("/withinRange")
    public Result<?> getVehiclesWithinRange(@RequestParam("minLat") double minLat,
                                                @RequestParam("maxLat") double maxLat,
                                                @RequestParam("minLng") double minLng,
                                                @RequestParam("maxLng") double maxLng) {
        return Result.success(vehicleService.getVehiclesWithinRange(minLat, maxLat, minLng, maxLng));
    }
}
