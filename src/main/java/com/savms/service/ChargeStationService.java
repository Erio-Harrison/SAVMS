package com.savms.service;

import com.savms.model.entity.Charger;
import com.savms.model.entity.Vehicle;

public interface ChargeStationService {
    void createStationService(Charger charger);

    Charger findStationById(Long id);

    void updateStation(Charger charger);

    void deleteByid(Long id);
}
