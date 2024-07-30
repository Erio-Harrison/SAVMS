package com.savms.integration.weather;

import java.util.Scanner;

public class WeatherData {
    private String location;
    private double temperature;
    private double precipitation;  //Sum of daily precipitation (including rain, showers and snowfall) (mm)
    /**
     * weatherCode means the most severe weather condition on a given day.
     * weatherCode	Description
     * 0	Clear sky
     * 1, 2, 3	Mainly clear, partly cloudy, and overcast
     * 45, 48	Fog and depositing rime fog
     * 51, 53, 55	Drizzle: Light, moderate, and dense intensity
     * 56, 57	Freezing Drizzle: Light and dense intensity
     * 61, 63, 65	Rain: Slight, moderate and heavy intensity
     * 66, 67	Freezing Rain: Light and heavy intensity
     * 71, 73, 75	Snow fall: Slight, moderate, and heavy intensity
     * 77	Snow grains
     * 80, 81, 82	Rain showers: Slight, moderate, and violent
     * 85, 86	Snow showers slight and heavy
     * 95 *	Thunderstorm: Slight or moderate
     * 96, 99 *	Thunderstorm with slight and heavy hail
     */
    private int weatherCode;
    private double windSpeed;
    private boolean isDay;
    private String time;

    // Getters and Setters
    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public double getPrecipitation() {
        return precipitation;
    }

    public void setPrecipitation(double precipitation) {
        this.precipitation = precipitation;
    }

    public int getWeatherCode() {
        return weatherCode;
    }

    public void setWeatherCode(int weatherCode) {
        this.weatherCode = weatherCode;
    }

    public double getWindSpeed() {
        return windSpeed;
    }

    public void setWindSpeed(double windSpeed) {
        this.windSpeed = windSpeed;
    }

    public boolean isDay() {
        return isDay;
    }

    public void setIsDay(boolean isDay) {
        this.isDay = isDay;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public static void main(String[] args) {
        WeatherIntegrationService weatherService = new WeatherIntegrationService();
        Scanner scanner = new Scanner(System.in);
        String location;

        do {
            System.out.println("===================================================");
            System.out.print("Enter Location (Say No to Quit): ");
            location = scanner.nextLine();

            if (location.equalsIgnoreCase("No")) break;

            // Retrieve weather data for the given location
            WeatherData weatherData = weatherService.getWeatherData(location);

            // Display the retrieved data
            if (weatherData != null) {
                System.out.println("Location: " + weatherData.getLocation());
                System.out.println("Current Time: " + weatherData.getTime());
                System.out.println("Current Temperature (C): " + weatherData.getTemperature());
                System.out.println("Precipitation: " + weatherData.getPrecipitation());
                System.out.println("Weather Code: " + weatherData.getWeatherCode());
                System.out.println("Wind Speed (m/s): " + weatherData.getWindSpeed());
                System.out.println("Is Day: " + (weatherData.isDay() ? "Yes" : "No"));
            } else {
                System.out.println("No data found for the given location.");
            }

        } while (!location.equalsIgnoreCase("No"));
    }
}
