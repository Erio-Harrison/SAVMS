package com.savms.mapper;

import com.savms.model.entity.Vehicle;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface VehicleMapper {
    void insert(Vehicle vehicle);

    Vehicle findById(Long id);

    void update(Vehicle vehicle);

    @Delete("delete from user where id =#{id}")
    void deleteByid(Long id);
}
