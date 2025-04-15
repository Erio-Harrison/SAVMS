package com.savms.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "vehicle")
public class Vehicle
{
    @Id
    private String id;
    private String licensePlate;
    private String carModel;
    private int year;
    private String energyType;
    private Size size;
    private Sensor radar;
    private Sensor camera;
    private Communication communication;
    private Location location;
    private double speed;
    private int leftoverEnergy;
    private int connectionStatus;
    private int taskStatus;
    private int healthStatus;
    private int engineRPM;
    private double lubeOilPressure;
    private double fuelPressure;
    private double coolantPressure;
    private double lubeOilTemp;
    private double coolantTemp;
    private int engineCondition;
    private LocalDateTime createdAt;

    // Inner classes for nested objects
    public static class Size
    {
        private double length;
        private double width;
        private double height;

        public Size() {}

        public Size( double length, double width, double height )
        {
            this.length = length;
            this.width = width;
            this.height = height;
        }

        // Getters and Setters
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

    }

    public static class Sensor
    {
        private String model;
        private int count;

        public Sensor() {}

        public Sensor( String model, int count )
        {
            this.model = model;
            this.count = count;
        }

        // Getters and Setters
        public String getModel() {
            return model;
        }

        public void setModel(String model) {
            this.model = model;
        }

        public int getCount() {
            return count;
        }

        public void setCount(int count) {
            this.count = count;
        }

    }

    public static class Communication
    {
        private String ipAddress;

        public Communication() {}

        public Communication(String ipAddress)
        {
            this.ipAddress = ipAddress;
        }

        // Getters and Setters
        public String getIpAddress() {
            return ipAddress;
        }

        public void setIpAddress(String ipAddress) {
            this.ipAddress = ipAddress;
        }

    }

    public static class Location
    {
        private double longitude;
        private double latitude;

        public Location() {}

        public Location( double longitude, double latitude )
        {
            this.longitude = longitude;
            this.latitude = latitude;
        }

        // Getters and Setters
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

    }

    // Constructors
    public Vehicle()
    {
        this.createdAt = LocalDateTime.now();
    }

    public Vehicle(String licensePlate, String carModel, int year, String energyType)
    {
        this();

        this.licensePlate = licensePlate;
        this.carModel = carModel;
        this.year = year;
        this.energyType = energyType;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public Size getSize() {
        return size;
    }

    public void setSize(Size size) {
        this.size = size;
    }

    public Sensor getRadar() {
        return radar;
    }

    public void setRadar(Sensor radar) {
        this.radar = radar;
    }

    public Sensor getCamera() {
        return camera;
    }

    public void setCamera(Sensor camera) {
        this.camera = camera;
    }

    public Communication getCommunication() {
        return communication;
    }

    public void setCommunication(Communication communication) {
        this.communication = communication;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString()
    {
        return "Vehicle{" +
                "id='" + id + '\'' +
                ", licensePlate='" + licensePlate + '\'' +
                ", carModel='" + carModel + '\'' +
                ", year=" + year +
                ", energyType='" + energyType + '\'' +
                ", speed=" + speed +
                ", leftoverEnergy=" + leftoverEnergy +
                ", createdAt=" + createdAt +
                '}';
    }
}
