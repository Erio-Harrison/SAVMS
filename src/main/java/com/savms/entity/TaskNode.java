package com.savms.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;


@Document(collection = "task") // MongoDB集合名为 task
public class TaskNode {

    @Id
    private String id;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int status;
    private Location startLocation;
    private Location endLocation;
    private Location vehicleLocation;

    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonPoint startPoint;

    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonPoint endPoint;

    private String assignedVehicleId;
    private VehicleInfo vehicle;

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public Location getStartLocation() {
        return startLocation;
    }

    public Location getVehicleLocation()
    {
        return vehicleLocation;
    }

    public void setVehicleLocation(Location vehicleLocation)
    {
        this.vehicleLocation = vehicleLocation;
    }

    public void setStartLocation(Location startLocation) {
        this.startLocation = startLocation;
        if (startLocation != null) {
            this.startPoint = new GeoJsonPoint(startLocation.getLng(), startLocation.getLat());
        }
    }

    public Location getEndLocation() {
        return endLocation;
    }

    public void setEndLocation(Location endLocation) {
        this.endLocation = endLocation;
        if (endLocation != null) {
            this.endPoint = new GeoJsonPoint(endLocation.getLng(), endLocation.getLat());
        }
    }

    public String getAssignedVehicleId() {
        return assignedVehicleId;
    }

    public void setAssignedVehicleId(String assignedVehicleId) {
        this.assignedVehicleId = assignedVehicleId;
    }

    public VehicleInfo getVehicle() {
        return vehicle;
    }

    public void setVehicle(VehicleInfo vehicle) {
        this.vehicle = vehicle;
    }

    public GeoJsonPoint getStartPoint() {
        return startPoint;
    }

    public GeoJsonPoint getEndPoint() {
        return endPoint;
    }

    // Inner classes
    @Setter
    @Getter
    public static class Location {
        private String address;
        private double lat;
        private double lng;

    }

    @Setter
    @Getter
    public static class VehicleInfo {
        private String vehicleNumber;
        private String plateNumber;

    }
}

