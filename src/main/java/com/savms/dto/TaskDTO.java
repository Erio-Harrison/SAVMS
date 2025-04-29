package com.savms.dto;

import java.time.LocalDateTime;

public class TaskDTO {
    private String id;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int status;
    private Object startLocation;
    private Object endLocation;
    private VehicleSummary vehicle;

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

    public Object getStartLocation() {
        return startLocation;
    }

    public void setStartLocation(Object startLocation) {
        this.startLocation = startLocation;
    }

    public Object getEndLocation() {
        return endLocation;
    }

    public void setEndLocation(Object endLocation) {
        this.endLocation = endLocation;
    }

    public VehicleSummary getVehicle() {
        return vehicle;
    }

    public void setVehicle(VehicleSummary vehicle) {
        this.vehicle = vehicle;
    }

    public static class VehicleSummary {
        private String id;
        private String licensePlate;
        private String carModel;

        public VehicleSummary(String id, String licensePlate, String carModel) {
            this.id = id;
            this.licensePlate = licensePlate;
            this.carModel = carModel;
        }

        public String getId() { return id; }
        public String getLicensePlate() { return licensePlate; }
        public String getCarModel() { return carModel; }
    }

}