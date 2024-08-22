package com.savms.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle implements Serializable {
    private Long id;
    private String registrationNumber;
    private Date registrationDate;
    private Float batteryLevel;
    private String currentLocation;
    private Integer status;
    private String vehicleDamage;
    private Date lastUpdate;
    private String model;
    private String manufacturer;

}
