package com.savms.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.savms.entity.Vehicle;
import com.savms.service.VehicleService;
import com.savms.utils.Result;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class VehicleControllerTest
{
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private VehicleService vehicleService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    public void testGetAllVehicles() throws Exception
    {
        Vehicle v1 = new Vehicle();
        v1.setLicensePlate( "ABC123" );

        Vehicle v2 = new Vehicle();
        v2.setLicensePlate( "XYZ789" );

        List<Vehicle> vehicles = Arrays.asList( v1, v2 );

        when( vehicleService.getAllVehicles() ).thenReturn( vehicles );

        mockMvc.perform(
                        get( "/vehicles/get/all" )
                )
                .andExpect( status().isOk() )
                .andExpect( jsonPath( "$.code" ).value( 1 ) )
                .andExpect( jsonPath( "$.data[0].licensePlate" ).value( "ABC123" ) )
                .andExpect( jsonPath( "$.data[1].licensePlate" ).value( "XYZ789" ) );
    }

    @Test
    public void testGetVehicleByVehicleIdFound() throws Exception
    {
        Vehicle v = new Vehicle();
        v.setLicensePlate( "TEST123" );

        when( vehicleService.getVehicleByVehicleId( "veh001" ) )
                .thenReturn( Optional.of( v ) );

        mockMvc.perform(
                        get( "/vehicles/get/id/veh001" )
                )
                .andExpect( status().isOk() )
                .andExpect( jsonPath( "$.licensePlate" ).value( "TEST123" ) );
    }

    @Test
    public void testGetVehicleByLicensePlateFound() throws Exception
    {
        Vehicle v = new Vehicle();
        v.setLicensePlate( "ZZZ999" );

        when( vehicleService.getVehicleByLicensePlate( "ZZZ999" ) )
                .thenReturn( Optional.of( v ) );

        mockMvc.perform(
                        get( "/vehicles/get/license/ZZZ999" )
                )
                .andExpect( status().isOk() )
                .andExpect( jsonPath( "$.licensePlate" ).value( "ZZZ999" ) );
    }

    @Test
    public void testGetVehicleByLicensePlateNotFound() throws Exception
    {
        when( vehicleService.getVehicleByLicensePlate( "NOTFOUND" ) )
                .thenReturn( Optional.empty() );

        mockMvc.perform(
                        get( "/vehicles/get/license/NOTFOUND" )
                )
                .andExpect( status().isOk() )
                .andExpect( jsonPath( "$" ).doesNotExist() );
    }

    @Test
    public void testGetVehicleByVehicleIdNotFound() throws Exception
    {
        when( vehicleService.getVehicleByVehicleId( "invalid-id" ) )
                .thenReturn( Optional.empty() );

        mockMvc.perform(
                        get( "/vehicles/get/id/invalid-id" )
                )
                .andExpect( status().isOk() )
                .andExpect( jsonPath( "$" ).doesNotExist() );
    }
}
