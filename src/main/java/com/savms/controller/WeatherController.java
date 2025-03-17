package com.savms.controller;

import com.savms.utils.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    private final String apiKey = "85ff642710374c1591810845251703";
    private final String weatherApiUrl = "https://api.weatherapi.com/v1/forecast.json";

    @GetMapping
    public Result<?> getWeather(@RequestParam String city) {

        String url = String.format("%s?key=%s&q=%s&days=2", weatherApiUrl, apiKey, city);

        RestTemplate restTemplate = new RestTemplate();

        try {
            String response = restTemplate.getForObject(url, String.class);

            System.out.println(response);

            return Result.success(response);

        } catch (Exception e) {

            return Result.error("获取天气失败: " + e.getMessage());
        }
    }
}
