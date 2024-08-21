package com.savms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.savms.model.vo.Vehicle01;
import com.savms.model.vo.VehicleStatus;
import com.savms.service.vehicle.VehicleService;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController1 {
    @Autowired
    private final VehicleService vehicleService;

    public VehicleController1(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }


    @PostMapping
    public ResponseEntity<Vehicle01> createVehicle(@RequestBody Vehicle01 vehicle) {
        Vehicle01 createdVehicle = vehicleService.createVehicle(vehicle);
        return ResponseEntity.ok(createdVehicle);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle01> getVehicle(@PathVariable String id) {
        Vehicle01 vehicle = vehicleService.getVehicleById(id);
        return ResponseEntity.ok(vehicle);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Vehicle01> updateVehicleStatus(@PathVariable String id, @RequestBody VehicleStatus status) {
        Vehicle01 updatedVehicle = vehicleService.updateVehicleStatus(id, status);
        return ResponseEntity.ok(updatedVehicle);
    }
}
