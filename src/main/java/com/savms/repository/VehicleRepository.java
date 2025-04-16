package com.savms.repository;

import com.savms.entity.Vehicle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Vehicle repository class.
 * Handles data operations for the vehicle collection in MongoDB.
 * Author: Yutong Cheng u7739713
 */
@Repository
public class VehicleRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * Adds a new vehicle to the database.
     * @param vehicle The vehicle object to be saved.
     */
    public void addVehicle(Vehicle vehicle) {
        mongoTemplate.save(vehicle);
        System.out.println("Vehicle added successfully: " + vehicle);
    }

    /**
     * Deletes a vehicle by its ID.
     * @param vehicleId The ID of the vehicle to be deleted.
     */
    public void deleteVehicleById(String vehicleId) {
        Query query = new Query(Criteria.where("id").is(vehicleId));
        mongoTemplate.remove(query, Vehicle.class);
    }

    /**
     * Finds a vehicle by its license plate.
     * @param licensePlate The license plate to search for.
     * @return An Optional containing the vehicle if found, otherwise empty.
     */
    public Optional<Vehicle> findByLicensePlate(String licensePlate) {
        Query query = new Query(Criteria.where("licensePlate").is(licensePlate));
        return Optional.ofNullable(mongoTemplate.findOne(query, Vehicle.class));
    }

    /**
     * Finds a vehicle by its vehicle ID.
     * @param vehicleId The vehicle ID to search for.
     * @return An Optional containing the vehicle if found, otherwise empty.
     */
    public Optional<Vehicle> findByVehicleId(String vehicleId) {
        Query query = new Query(Criteria.where("vehicleId").is(vehicleId));
        return Optional.ofNullable(mongoTemplate.findOne(query, Vehicle.class));
    }

    /**
     * Updates the IP address of a vehicle.
     * @param vehicleId The ID of the vehicle.
     * @param newIpAddress The new IP address to set.
     */
    public void updateIpAddress(String vehicleId, String newIpAddress) {
        Vehicle vehicle = mongoTemplate.findById(vehicleId, Vehicle.class);
        if (vehicle != null) {
            vehicle.setIpAddress(newIpAddress);
            mongoTemplate.save(vehicle);
        }
    }

    /**
     * Updates the status of a vehicle.
     * @param vehicleId The ID of the vehicle.
     * @param newStatus The new connection status (0 or 1).
     */
    public void updateConnectionStatus(String vehicleId, int newStatus) {
        Vehicle vehicle = mongoTemplate.findById(vehicleId, Vehicle.class);
        if (vehicle != null) {
            vehicle.setConnectionStatus(newStatus);
            mongoTemplate.save(vehicle);
        }
    }

    /**
     * Retrieves all vehicles from the database.
     * @return A list of all vehicles.
     */
    public List<Vehicle> getAllVehicles() {
        return mongoTemplate.findAll(Vehicle.class);
    }

    /**
     * 根据地图范围获取车辆信息
     */
    public List<Vehicle> findVehiclesWithinRange(double minLat,
                                                 double maxLat,
                                                 double minLng,
                                                 double maxLng) {
        Query query = new Query();
        query.addCriteria(Criteria.where("location.latitude").gte(minLat).lte(maxLat));
        query.addCriteria(Criteria.where("location.longitude").gte(minLng).lte(maxLng));

        return mongoTemplate.find(query, Vehicle.class);
    }
}
