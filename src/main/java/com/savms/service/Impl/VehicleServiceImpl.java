package com.savms.service.Impl;

import com.savms.mapper.VehicleMapper;
import com.savms.model.entity.Vehicle;
import com.savms.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VehicleServiceImpl implements VehicleService {
    @Autowired
    private VehicleMapper vehicleMapper;



    public void createVehicle(Vehicle vehicle) {
        vehicleMapper.insert(vehicle);
    }

    public Vehicle findVehicleById(Long id) {
        Vehicle vehicle = vehicleMapper.findById(id);
        return vehicle;
    }


    public Void updateVehicle(Vehicle vehicle) {
        vehicleMapper.update(vehicle);
        return null;
    }

    @Override
    public void deleteByid(Long id) {
        vehicleMapper.deleteByid(id);
    }


}
