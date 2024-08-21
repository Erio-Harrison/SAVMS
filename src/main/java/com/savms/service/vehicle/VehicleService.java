package com.savms.service.vehicle;

import com.savms.model.vo.Vehicle01;
import com.savms.model.vo.VehicleStatus;
import com.savms.repository.VehicleRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VehicleService {
    @Autowired
    private final VehicleRepository vehicleRepository;


    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @Transactional(readOnly = true)
    public Vehicle01 getVehicleById(String vehicleId) {
        return vehicleRepository.findByVehicleId(vehicleId)
                .orElseThrow();
    }

    @Transactional
    public Vehicle01 createVehicle(Vehicle01 vehicle) {
        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public Vehicle01 updateVehicleStatus(String vehicleId, VehicleStatus newStatus) {
        Vehicle01 vehicle = getVehicleById(vehicleId);
        vehicle.setStatus(newStatus);
        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public void deleteVehicle(String vehicleId) {
        Vehicle01 vehicle = getVehicleById(vehicleId);
        vehicleRepository.delete(vehicle);
    }

    @Transactional(readOnly = true)
    public List<Vehicle01> getVehiclesByStatus(VehicleStatus status) {
        return vehicleRepository.findByStatus(status);
    }

    @Transactional
    public Vehicle01 updateVehicleLocation(String vehicleId, double latitude, double longitude) {
        Vehicle01 vehicle = getVehicleById(vehicleId);
        vehicle.setLatitude(latitude);
        vehicle.setLongitude(longitude);
        return vehicleRepository.save(vehicle);
    }
}