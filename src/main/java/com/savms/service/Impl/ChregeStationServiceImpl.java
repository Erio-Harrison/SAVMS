package com.savms.service.Impl;

import com.savms.mapper.ChargeStationMapper;

import com.savms.model.entity.Charger;
import com.savms.model.entity.Vehicle;
import com.savms.service.ChargeStationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChregeStationServiceImpl implements ChargeStationService {
    @Autowired
    private ChargeStationMapper chargeStationMapper;

    public void createStationService(Charger charger) {
        chargeStationMapper.insert(charger);
    }

    @Override
    public Charger findStationById(Long id) {
        Charger charger = chargeStationMapper.findById(id);
        return charger;
    }



    public void updateStation(Charger charger) {
        chargeStationMapper.update(charger);

    }


    public void deleteByid(Long id) {
        chargeStationMapper.deleteByid(id);
    }
}
