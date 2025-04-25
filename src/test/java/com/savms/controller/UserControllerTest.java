package com.savms.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.savms.entity.User;
import com.savms.service.UserService;

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
public class UserControllerTest
{
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    public void testGetAllUsers() throws Exception
    {
        User user1 = new User();
        user1.setId( "1" );
        user1.setUsername( "alice" );

        User user2 = new User();
        user2.setId( "2" );
        user2.setUsername( "bob" );

        List<User> userList = Arrays.asList( user1, user2 );

        when( userService.getAllUsers() ).thenReturn( userList );

        mockMvc.perform(
                        get( "/users/get/all" )
                )
                .andExpect( status().isOk() )
                .andExpect( jsonPath( "$[0].username" ).value( "alice" ) )
                .andExpect( jsonPath( "$[1].username" ).value( "bob" ) );
    }

    @Test
    public void testGetUserByEmailFound() throws Exception
    {
        User user = new User();
        user.setId( "3" );
        user.setUsername( "charlie" );
        user.setEmail( "charlie@example.com" );

        when( userService.getUserByEmail( "charlie@example.com" ) )
                .thenReturn( Optional.of( user ) );

        mockMvc.perform(
                        get( "/users/getByEmail/charlie@example.com" )
                )
                .andExpect( status().isOk() )
                .andExpect( jsonPath( "$.username" ).value( "charlie" ) );
    }

    @Test
    public void testGetUserByEmailNotFound() throws Exception
    {
        when( userService.getUserByEmail( "notfound@example.com" ) )
                .thenReturn( Optional.empty() );

        mockMvc.perform(
                        get( "/users/getByEmail/notfound@example.com" )
                )
                .andExpect( status().isOk() )
                .andExpect( jsonPath( "$" ).doesNotExist() );
    }
}
