package com.savms.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceHistory {
    private Long id;
    private Long userId;
    private Date date;
    private String description;
}
