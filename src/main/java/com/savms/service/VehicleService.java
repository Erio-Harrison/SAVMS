package com.savms.service;

import com.savms.model.entity.Vehicle;

public interface VehicleService  {

    void createVehicle(Vehicle vehicle);

    Vehicle findVehicleById(Long id);

    Void updateVehicle(Vehicle vehicle);

    void deleteByid(Long id);
}
