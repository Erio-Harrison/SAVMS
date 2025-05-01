package com.savms.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.savms.dto.LoginRequest;
import com.savms.entity.User;
import com.savms.security.JwtUtil;
import com.savms.service.UserService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
public class LoginControllerTest
{
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtUtil jwtUtil;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    public void testLoginSuccess() throws Exception
    {
        LoginRequest request = new LoginRequest();
        request.setUsername( "testuser" );
        request.setPassword( "testpass" );

        User user = new User();
        user.setId( "123" );
        user.setUsername( "testuser" );
        user.setPassword( "testpass" );
        user.setEmail( "test@example.com" );

        when( userService.getUserByUsername( "testuser" ) )
                .thenReturn( Optional.of( user ) );

        when( jwtUtil.generateToken( "123", "testuser" ) )
                .thenReturn( "mock-token" );

        mockMvc.perform(
                        post( "/api/auth/login" )
                                .contentType( MediaType.APPLICATION_JSON )
                                .content( objectMapper.writeValueAsString( request ) )
                )
                .andExpect( status().isOk() )
                .andExpect( jsonPath( "$.code" ).value( 1 ) )
                .andExpect( jsonPath( "$.data.token" ).value( "mock-token" ) )
                .andExpect( jsonPath( "$.data.username" ).value( "testuser" ) );
    }

    @Test
    public void testLoginWrongPassword() throws Exception
    {
        LoginRequest request = new LoginRequest();
        request.setUsername( "testuser" );
        request.setPassword( "wrongpass" );

        User user = new User();
        user.setId( "123" );
        user.setUsername( "testuser" );
        user.setPassword( "correctpass" );

        when( userService.getUserByUsername( "testuser" ) )
                .thenReturn( Optional.of( user ) );

        mockMvc.perform(
                        post( "/api/auth/login" )
                                .contentType( MediaType.APPLICATION_JSON )
                                .content( objectMapper.writeValueAsString( request ) )
                )
                .andExpect( status().isOk() )
                .andExpect( jsonPath( "$.code" ).value( 0 ) )
                .andExpect( jsonPath( "$.msg" ).value( "Login failed: Wrong password" ) );
    }

    @Test
    public void testLoginUserNotFound() throws Exception
    {
        LoginRequest request = new LoginRequest();
        request.setUsername( "nouser" );
        request.setPassword( "pass" );

        when( userService.getUserByUsername( "nouser" ) )
                .thenReturn( Optional.empty() );

        mockMvc.perform(
                        post( "/api/auth/login" )
                                .contentType( MediaType.APPLICATION_JSON )
                                .content( objectMapper.writeValueAsString( request ) )
                )
                .andExpect( status().isOk() )
                .andExpect( jsonPath( "$.code" ).value( 0 ) )
                .andExpect( jsonPath( "$.msg" ).value( "Login failed: User not found" ) );
    }
}
