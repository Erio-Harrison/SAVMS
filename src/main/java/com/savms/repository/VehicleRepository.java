package com.savms.repository;

import com.savms.entity.Vehicle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.geo.Point;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.GeoResults;
import org.springframework.data.mongodb.core.query.NearQuery;

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
     * Get vehicle information based on map range
     */
    public List<Vehicle> findVehiclesWithinRange(double minLat,
                                                 double maxLat,
                                                 double minLng,
                                                 double maxLng) {
        Query query = new Query();
        query.addCriteria(Criteria.where("latitude").gte(minLat).lte(maxLat));
        query.addCriteria(Criteria.where("longitude").gte(minLng).lte(maxLng));

        return mongoTemplate.find(query, Vehicle.class);
    }

    /**
     * Query the vehicles within a radius of a specified point and return the results sorted by distance
     */
    public GeoResults<Vehicle> findNearbyVehicles(double centerLng,
                                                  double centerLat,
                                                  double radiusMeters) {
        Point location = new Point(centerLng, centerLat);
        Distance distance = new Distance(radiusMeters / 1000.0, Metrics.KILOMETERS);
        NearQuery nearQuery = NearQuery.near(location).maxDistance(distance);
        return mongoTemplate.geoNear(nearQuery, Vehicle.class);
    }
}
