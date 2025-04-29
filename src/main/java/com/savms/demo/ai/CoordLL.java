package com.savms.demo.ai;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * The coordinate of latitude and longitude
 */
@AllArgsConstructor
@Data
public class CoordLL {
    private double latitude;
    private double longitude;

    @Override
    public String toString() {
        return "(" + latitude + ", " + longitude + ")";
    }
}
