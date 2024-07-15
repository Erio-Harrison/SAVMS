package com.savms.service.vehicle;

import com.savms.model.Vehicle;
import com.savms.model.VehicleStatus;
import com.savms.repository.VehicleRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    @Autowired
    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @Transactional(readOnly = true)
    public Vehicle getVehicleById(String vehicleId) {
        return vehicleRepository.findByVehicleId(vehicleId)
                .orElseThrow();
    }

    @Transactional
    public Vehicle createVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public Vehicle updateVehicleStatus(String vehicleId, VehicleStatus newStatus) {
        Vehicle vehicle = getVehicleById(vehicleId);
        vehicle.setStatus(newStatus);
        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public void deleteVehicle(String vehicleId) {
        Vehicle vehicle = getVehicleById(vehicleId);
        vehicleRepository.delete(vehicle);
    }

    @Transactional(readOnly = true)
    public List<Vehicle> getVehiclesByStatus(VehicleStatus status) {
        return vehicleRepository.findByStatus(status);
    }

    @Transactional
    public Vehicle updateVehicleLocation(String vehicleId, double latitude, double longitude) {
        Vehicle vehicle = getVehicleById(vehicleId);
        vehicle.setLatitude(latitude);
        vehicle.setLongitude(longitude);
        return vehicleRepository.save(vehicle);
    }
}