package com.savms.service;

import com.savms.repository.VehicleRepository;
import com.savms.entity.Vehicle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Vehicle service class.
 * Receives and handles data from the vehicle repository.
 * Author: Yutong Cheng u7739713
 */
@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    /**
     * Saves a new vehicle.
     * @param vehicle The vehicle to be saved.
     */
    public void saveVehicle(Vehicle vehicle) {
        vehicleRepository.addVehicle(vehicle);
    }

    /**
     * Deletes a vehicle by its ID.
     * @param vehicleId The ID of the vehicle to be deleted.
     */
    public void deleteVehicle(String vehicleId) {
        vehicleRepository.deleteVehicleById(vehicleId);
    }

    /**
     * Finds a vehicle by license plate.
     * @param licensePlate The license plate to search for.
     * @return An Optional containing the vehicle if found.
     */
    public Optional<Vehicle> getVehicleByLicensePlate(String licensePlate) {
        return vehicleRepository.findByLicensePlate(licensePlate);
    }

    /**
     * Finds a vehicle by its vehicle ID.
     * @param vehicleId The vehicle ID to search for.
     * @return An Optional containing the vehicle if found.
     */
    public Optional<Vehicle> getVehicleByVehicleId(String vehicleId) {
        return vehicleRepository.findByVehicleId(vehicleId);
    }

    /**
     * Updates a vehicle's connection status.
     * @param vehicleId The ID of the vehicle.
     * @param newStatus The new connection status (0 or 1).
     */
    public void updateVehicleConnectionStatus(String vehicleId, int newStatus) {
        vehicleRepository.updateConnectionStatus(vehicleId, newStatus);
    }

    /**
     * Retrieves all vehicles from the database.
     * @return A list of all vehicles.
     */
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.getAllVehicles();
    }
}
