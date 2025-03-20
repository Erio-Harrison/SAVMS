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
