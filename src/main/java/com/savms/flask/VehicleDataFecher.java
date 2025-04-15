package com.savms.flask;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.savms.entity.Vehicle;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.Iterator;
import java.util.Map;

public class VehicleDataFecher implements Runnable {
    private final HttpClient client = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();
    private final String endpoint = "http://localhost:5000/latest-data";

    @Override
    public void run() {
        while (true) {
            try {
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(endpoint))
                        .GET()
                        .build();

                HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
                String json = response.body();

                JsonNode root = mapper.readTree(json);
                JsonNode telemetryNode = root.get("telemetry");

                if (telemetryNode != null) {
                    Iterator<Map.Entry<String, JsonNode>> fields = telemetryNode.fields();
                    while (fields.hasNext()) {
                        Map.Entry<String, JsonNode> entry = fields.next();
                        JsonNode vehicleData = entry.getValue();
                        Vehicle v = convertToVehicle(vehicleData);
                        System.out.println("解析结果: " + v);
                        // TODO: 存入数据库或内存缓存等
                    }
                }

                // 每秒执行一次
                Thread.sleep(1000);
            } catch (Exception e) {
                System.err.println("请求或解析失败：" + e.getMessage());
                try { Thread.sleep(2000); } catch (InterruptedException ignored) {}
            }
        }
    }

    private Vehicle convertToVehicle(JsonNode data) {
        // TODO
        return null;
    }

}

