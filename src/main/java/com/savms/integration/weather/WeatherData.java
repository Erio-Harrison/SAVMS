package com.savms.integration.weather;

import org.json.JSONArray;
import org.json.JSONObject;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

public class WeatherData {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            String location;
            do {
                // Retrieve user input
                System.out.println("===================================================");
                System.out.print("Enter Location (Say No to Quit): ");
                location = scanner.nextLine();

                if (location.equalsIgnoreCase("No")) break;

                // Get location data
                JSONObject cityLocationData = getLocationData(location);
                if (cityLocationData == null) {
                    System.out.println("No data found for the city.");
                    continue;
                }

                double latitude = ((BigDecimal) cityLocationData.get("latitude")).doubleValue();
                double longitude = ((BigDecimal) cityLocationData.get("longitude")).doubleValue();

                // Display weather data based on the obtained latitude and longitude
                displayWeatherData(latitude, longitude);
            } while (!location.equalsIgnoreCase("No"));

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static JSONObject getLocationData(String city) {
        city = city.replaceAll(" ", "+");

        String urlString = "https://geocoding-api.open-meteo.com/v1/search?name=" +
                city + "&count=1&language=en&format=json";

        try {
            // 1. Fetch the API response based on the API URL
            HttpURLConnection apiConnection = fetchApiResponse(urlString);

            // Check for response status
            // 200 - means that the connection was successful
            if (apiConnection.getResponseCode() != 200) {
                System.out.println("Error: Could not connect to API");
                return null;
            }

            // 2. Read the response and store it as a String
            String jsonResponse = readApiResponse(apiConnection);

            // 3. Parse the String into a JSON Object
            JSONObject resultsJsonObj = new JSONObject(jsonResponse);

            // 4. Retrieve Location Data
            JSONArray locationData = resultsJsonObj.getJSONArray("results");
            if (locationData.isEmpty()) {
                return null;
            }
            return locationData.getJSONObject(0);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private static void displayWeatherData(double latitude, double longitude) {
        try {
            // 1. Fetch the API response based on the latitude and longitude
            String url = "https://api.open-meteo.com/v1/forecast?latitude=" + latitude +
                    "&longitude=" + longitude + "&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto";
            HttpURLConnection apiConnection = fetchApiResponse(url);

            // Check for response status
            // 200 - means that the connection was successful
            if (apiConnection.getResponseCode() != 200) {
                System.out.println("Error: Could not connect to API");
                return;
            }

            // 2. Read the response and store it as a String
            String jsonResponse = readApiResponse(apiConnection);

            // 3. Parse the String into a JSON Object
            JSONObject jsonObject = new JSONObject(jsonResponse);
            JSONObject currentWeatherJson = jsonObject.getJSONObject("current");

            // 4. Store the data into their corresponding data types
            String time = (String) currentWeatherJson.get("time");
            System.out.println("Current Time: " + time);

            double temperature = ((BigDecimal) currentWeatherJson.get("temperature_2m")).doubleValue();
            System.out.println("Current Temperature (C): " + temperature);

            Object relativeHumidityObj = currentWeatherJson.get("relative_humidity_2m");
            long relativeHumidity = relativeHumidityObj instanceof Number ? ((Number) relativeHumidityObj).longValue() : 0;
            System.out.println("Relative Humidity: " + relativeHumidity);

            Object windSpeedObj = currentWeatherJson.get("wind_speed_10m");
            double windSpeed = windSpeedObj instanceof Number ? ((Number) windSpeedObj).doubleValue() : 0.0;
            System.out.println("Wind Speed (m/s): " + windSpeed);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static String readApiResponse(HttpURLConnection apiConnection) {
        try {
            // Create a StringBuilder to store the resulting JSON data
            StringBuilder resultJson = new StringBuilder();

            // Create a Scanner to read from the InputStream of the HttpURLConnection
            Scanner scanner = new Scanner(apiConnection.getInputStream());

            // Loop through each line in the response and append it to the StringBuilder
            while (scanner.hasNext()) {
                resultJson.append(scanner.nextLine());
            }

            // Close the Scanner to release resources
            scanner.close();

            // Return the JSON data as a String
            return resultJson.toString();

        } catch (IOException e) {
            // Print the exception details in case of an IOException
            e.printStackTrace();
        }

        // Return null if there was an issue reading the response
        return null;
    }

    private static HttpURLConnection fetchApiResponse(String urlString) {
        try {
            // Attempt to create a connection
            URL url = new URL(urlString);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            // Set request method to GET
            conn.setRequestMethod("GET");

            return conn;
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Return null if the connection could not be made
        return null;
    }
}
