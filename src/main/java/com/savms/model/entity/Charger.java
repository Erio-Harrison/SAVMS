package com.savms.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Charger {
    private Long id;
    private Long stationId;
    private String name;
    private String location;
    private Integer type;
    private Float maxPower;
    private Integer connectorType;

}
