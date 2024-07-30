package com.savms.integration.map;
import org.springframework.stereotype.Service;

import com.google.maps.GeoApiContext;
import com.google.maps.PlacesApi;
import com.google.maps.errors.ApiException;
import com.google.maps.model.PlacesSearchResponse;
import com.google.maps.model.PlacesSearchResult;


import java.io.IOException;

@Service
public class MapIntegrationService {

    private final GeoApiContext context;

    public MapIntegrationService() {
        this.context = new GeoApiContext.Builder()
                .apiKey("AIzaSyB8WjwiA4dIPzZP5d4HFVfNloCM5PWAJro") // 替换为您的实际API密钥
                .build();
    }

    // Method to retrieve map data based on a given area name
    public MapData getMapData(String area) {
        MapData mapData = new MapData();
        try {
            // Use Places API to perform a text search for the given area
            PlacesSearchResponse response = PlacesApi.textSearchQuery(context, area).await();
            if (response.results != null && response.results.length > 0) {
                // Retrieve the first search result
                PlacesSearchResult result = response.results[0];
                mapData.setName(result.name);
                mapData.setAddress(result.formattedAddress);
                mapData.setPlaceId(result.placeId);
            } else {
                System.out.println("No results found for the given area.");
            }
        } catch (ApiException | InterruptedException | IOException e) {
            e.printStackTrace();
        }
        return mapData;
    }

    // Method to shutdown the GeoApiContext and release resources
    public void shutdown() {
        context.shutdown();
    }
}