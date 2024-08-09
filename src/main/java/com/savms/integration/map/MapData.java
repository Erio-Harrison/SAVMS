package com.savms.integration.map;

import org.springframework.stereotype.Service;

public class MapData {
    private String name;
    private String address;
    private String placeId;

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPlaceId() {
        return placeId;
    }

    public void setPlaceId(String placeId) {
        this.placeId = placeId;
    }

    public static void main(String[] args) {
        // Instantiate the MapIntegrationService class
        MapIntegrationService mapService = new MapIntegrationService();

        // Specify the area name to search for
        String area = "Eiffel Tower, Paris, France";

        // Retrieve map data for the specified area
        MapData mapData = mapService.getMapData(area);

        // Print the retrieved data
        if (mapData != null) {
            System.out.println("Name: " + mapData.getName());
            System.out.println("Address: " + mapData.getAddress());
            System.out.println("Place ID: " + mapData.getPlaceId());
        } else {
            System.out.println("No data found for the given area.");
        }

        // Shutdown the service to release resources
        mapService.shutdown();
    }
}
