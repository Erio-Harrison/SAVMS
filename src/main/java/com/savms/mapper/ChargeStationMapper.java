package com.savms.mapper;

import com.savms.model.entity.Charger;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ChargeStationMapper {
   Charger findById(Long id) ;

    void insert(Charger charger);

    void update(Charger charger);

    void deleteByid(Long id);
}
