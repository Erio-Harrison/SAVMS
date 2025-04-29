package com.savms.entity;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Location {
    private String address;
    private double lat;
    private double lng;

    @Override
    public String toString() {
        return "Location{" +
                "address='" + address + '\'' +
                ", lat=" + lat +
                ", lng=" + lng +
                '}';
    }
}