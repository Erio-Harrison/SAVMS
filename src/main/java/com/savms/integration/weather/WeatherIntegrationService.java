package com.savms.integration.weather;

import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

@Service
public class WeatherIntegrationService {

    // Method to retrieve weather data for a given location
    public WeatherData getWeatherData(String location) {
        // Get location data (latitude and longitude)
        JSONObject cityLocationData = getLocationData(location);
        if (cityLocationData == null) {
            return null;
        }

        double latitude = cityLocationData.getDouble("latitude");
        double longitude = cityLocationData.getDouble("longitude");

        // Get weather data for the location
        return fetchWeatherData(latitude, longitude, location);
    }

    // Method to fetch location data (latitude and longitude) using the geocoding API
    private JSONObject getLocationData(String city) {
        city = city.replaceAll(" ", "+");

        String urlString = "https://geocoding-api.open-meteo.com/v1/search?name=" +
                city + "&count=1&language=en&format=json";

        try {
            HttpURLConnection apiConnection = fetchApiResponse(urlString);

            if (apiConnection.getResponseCode() != 200) {
                System.out.println("Error: Could not connect to API");
                return null;
            }

            String jsonResponse = readApiResponse(apiConnection);
            JSONObject resultsJsonObj = new JSONObject(jsonResponse);
            if (!resultsJsonObj.has("results")) {
                return null;
            }
            return resultsJsonObj.getJSONArray("results").getJSONObject(0);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    // Method to fetch weather data for the given latitude and longitude
    private WeatherData fetchWeatherData(double latitude, double longitude, String location) {
        try {
            // Adjusted URL to include only the required fields
            String url = "https://api.open-meteo.com/v1/forecast?latitude=" + latitude +
                    "&longitude=" + longitude + "&current_weather=true&timezone=auto&current_weather_fields=temperature,precipitation,weathercode,windspeed,is_day";
            HttpURLConnection apiConnection = fetchApiResponse(url);

            if (apiConnection.getResponseCode() != 200) {
                System.out.println("Error: Could not connect to API");
                return null;
            }

            String jsonResponse = readApiResponse(apiConnection);
            JSONObject jsonObject = new JSONObject(jsonResponse);
            JSONObject currentWeatherJson = jsonObject.getJSONObject("current_weather");

            WeatherData weatherData = new WeatherData();
            weatherData.setLocation(location);
            weatherData.setTime(currentWeatherJson.getString("time"));
            weatherData.setTemperature(currentWeatherJson.getDouble("temperature"));
            weatherData.setPrecipitation(currentWeatherJson.optDouble("precipitation", 0.0));
            weatherData.setWeatherCode(currentWeatherJson.getInt("weathercode"));
            weatherData.setWindSpeed(currentWeatherJson.getDouble("windspeed"));
            weatherData.setIsDay(currentWeatherJson.getInt("is_day") == 1);

            return weatherData;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    // Utility method to read the API response and convert it to a String
    private static String readApiResponse(HttpURLConnection apiConnection) {
        try {
            StringBuilder resultJson = new StringBuilder();
            Scanner scanner = new Scanner(apiConnection.getInputStream());

            while (scanner.hasNext()) {
                resultJson.append(scanner.nextLine());
            }
            scanner.close();
            return resultJson.toString();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    // Utility method to establish an HTTP connection and fetch the API response
    private static HttpURLConnection fetchApiResponse(String urlString) {
        try {
            URL url = new URL(urlString);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            return conn;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
}
