package com.savms.repository;

import org.springframework.stereotype.Repository;

import com.savms.model.Vehicle;
import com.savms.model.VehicleStatus;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository {
    Optional<Vehicle> findByVehicleId(String vehicleId);
    List<Vehicle> findByStatus(VehicleStatus status);
    Vehicle save(Vehicle vehicle);
    void delete(Vehicle vehicle);
}