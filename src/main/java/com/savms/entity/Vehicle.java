package com.savms.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "vehicle")
public class Vehicle {

    @Id
    private String id;                  // Internal MongoDB document ID

    // Basic Vehicle Info
    private String vehicleId;           // 8-digit alphanumeric ID
    private String licensePlate;        // e.g. "ABC-123"
    private String carModel;            // e.g. "Tesla Model 3"
    private int year;                   // e.g. 2022
    private String energyType;          // electrical/fuel/mixed

    // Vehicle Dimensions
    private double length;
    private double width;
    private double height;

    // Radar
    private String radarModel;
    private int radarCount;

    // Camera
    private String cameraModel;
    private int cameraCount;

    // Communication
    private String ipAddress;

    // Running Info
    private double longitude;
    private double latitude;
    private double speed;               // e.g. 7.869999886
    private int leftoverEnergy;         // 0-100
    private int connectionStatus;       // 0/1
    private int taskStatus;            // 0/1
    private int healthStatus;          // 0/1

    // Engine Info
    private int engineRPM;
    private double lubeOilPressure;
    private double fuelPressure;
    private double coolantPressure;
    private double lubeOilTemp;
    private double coolantTemp;
    private int engineCondition;       // 0/1

    // Constructors
    public Vehicle() {
    }

    public Vehicle(String vehicleId, String licensePlate, String carModel) {
        this.vehicleId = vehicleId;
        this.licensePlate = licensePlate;
        this.carModel = carModel;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getVehicleId() {
        return vehicleId;
    }
    public void setVehicleId(String vehicleId) {
        this.vehicleId = vehicleId;
    }

    public String getLicensePlate() {
        return licensePlate;
    }
    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public String getCarModel() {
        return carModel;
    }
    public void setCarModel(String carModel) {
        this.carModel = carModel;
    }

    public int getYear() {
        return year;
    }
    public void setYear(int year) {
        this.year = year;
    }

    public String getEnergyType() {
        return energyType;
    }
    public void setEnergyType(String energyType) {
        this.energyType = energyType;
    }

    public double getLength() {
        return length;
    }
    public void setLength(double length) {
        this.length = length;
    }

    public double getWidth() {
        return width;
    }
    public void setWidth(double width) {
        this.width = width;
    }

    public double getHeight() {
        return height;
    }
    public void setHeight(double height) {
        this.height = height;
    }

    public String getRadarModel() {
        return radarModel;
    }
    public void setRadarModel(String radarModel) {
        this.radarModel = radarModel;
    }

    public int getRadarCount() {
        return radarCount;
    }
    public void setRadarCount(int radarCount) {
        this.radarCount = radarCount;
    }

    public String getCameraModel() {
        return cameraModel;
    }
    public void setCameraModel(String cameraModel) {
        this.cameraModel = cameraModel;
    }

    public int getCameraCount() {
        return cameraCount;
    }
    public void setCameraCount(int cameraCount) {
        this.cameraCount = cameraCount;
    }

    public String getIpAddress() {
        return ipAddress;
    }
    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public double getLongitude() {
        return longitude;
    }
    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getLatitude() {
        return latitude;
    }
    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getSpeed() {
        return speed;
    }
    public void setSpeed(double speed) {
        this.speed = speed;
    }

    public int getLeftoverEnergy() {
        return leftoverEnergy;
    }
    public void setLeftoverEnergy(int leftoverEnergy) {
        this.leftoverEnergy = leftoverEnergy;
    }

    public int getConnectionStatus() {
        return connectionStatus;
    }
    public void setConnectionStatus(int connectionStatus) {
        this.connectionStatus = connectionStatus;
    }

    public int getTaskStatus() {
        return taskStatus;
    }
    public void setTaskStatus(int taskStatus) {
        this.taskStatus = taskStatus;
    }

    public int getHealthStatus() {
        return healthStatus;
    }
    public void setHealthStatus(int healthStatus) {
        this.healthStatus = healthStatus;
    }

    public int getEngineRPM() {
        return engineRPM;
    }
    public void setEngineRPM(int engineRPM) {
        this.engineRPM = engineRPM;
    }

    public double getLubeOilPressure() {
        return lubeOilPressure;
    }
    public void setLubeOilPressure(double lubeOilPressure) {
        this.lubeOilPressure = lubeOilPressure;
    }

    public double getFuelPressure() {
        return fuelPressure;
    }
    public void setFuelPressure(double fuelPressure) {
        this.fuelPressure = fuelPressure;
    }

    public double getCoolantPressure() {
        return coolantPressure;
    }
    public void setCoolantPressure(double coolantPressure) {
        this.coolantPressure = coolantPressure;
    }

    public double getLubeOilTemp() {
        return lubeOilTemp;
    }
    public void setLubeOilTemp(double lubeOilTemp) {
        this.lubeOilTemp = lubeOilTemp;
    }

    public double getCoolantTemp() {
        return coolantTemp;
    }
    public void setCoolantTemp(double coolantTemp) {
        this.coolantTemp = coolantTemp;
    }

    public int getEngineCondition() {
        return engineCondition;
    }
    public void setEngineCondition(int engineCondition) {
        this.engineCondition = engineCondition;
    }

    @Override
    public String toString() {
        return "Vehicle{" +
                "id='" + id + '\'' +
                ", vehicleId='" + vehicleId + '\'' +
                ", licensePlate='" + licensePlate + '\'' +
                ", carModel='" + carModel + '\'' +
                ", year=" + year +
                ", energyType='" + energyType + '\'' +
                // ... you can include more fields here ...
                '}';
    }
}
