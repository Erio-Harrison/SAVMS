package com.savms.controller;

import com.savms.entity.Vehicle;
import com.savms.service.VehicleService;
import com.savms.utils.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.GeoResults;
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
@Tag(name = "Vehicle Management", description = "Vehicle management and tracking APIs")
public class VehicleController {
    @Autowired
    private VehicleService vehicleService;

    /**
     * Creates a new vehicle.
     * @param vehicle The vehicle to be created.
     */
    @Operation(summary = "Create Vehicle", description = "Register a new vehicle in the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Vehicle created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid vehicle data")
    })
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

    @DeleteMapping("/delete/byPlate")
    public Result deleteVehicleByPlate(@RequestBody List<String> plates) {

        if (plates == null || plates.isEmpty()) {
            return Result.error("plates == null or empty");
        }
        System.out.println(plates);
        int deletedCount = vehicleService.deleteVehiclesByPlates(plates);

        Result result = Result.success();
        result.setMsg("Successfully deleted " + deletedCount + " vehicles.");
        return result;
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
        System.out.println(vehicleId);
        return vehicleService.getVehicleByVehicleId(vehicleId);
    }

    /**
     * Retrieves all vehicles.
     * @return A list of all vehicles.
     */
    @GetMapping("/get/all")
    public Result getAllVehicles() {
        return Result.success(vehicleService.getAllVehicles());
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
     * Query vehicles based on the visible area of the map
     * Interface path: /vehicles/withinRange
     *
     * @param minLat south latitude
     * @param maxLat north latitude
     * @param minLng west longitude
     * @param maxLng east longitude
     * @return a list of vehicles within the specified range
     */
    @GetMapping("/withinRange")
    public Result<?> getVehiclesWithinRange(@RequestParam("minLat") double minLat,
                                            @RequestParam("maxLat") double maxLat,
                                            @RequestParam("minLng") double minLng,
                                            @RequestParam("maxLng") double maxLng) {
        return Result.success(vehicleService.getVehiclesWithinRange(minLat, maxLat, minLng, maxLng));
    }

    /**
     * Get vehicles within radius meters near a specified point
     * Example: GET /vehicles/nearby?lng=116.39&lat=39.91&radius=5000
     */
    @GetMapping("/nearby")
    public GeoResults<Vehicle> getNearbyVehicles(
            @RequestParam double lng,
            @RequestParam double lat,
            @RequestParam(defaultValue="5000") double radius
    ) {
        return vehicleService.getNearbyVehicles(lng, lat, radius);
    }
}
