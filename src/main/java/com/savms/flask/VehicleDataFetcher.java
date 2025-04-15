package com.savms.flask;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.savms.entity.Vehicle;
import com.savms.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Iterator;
import java.util.Map;


@Component
public class VehicleDataFetcher implements Runnable {
    private final HttpClient client = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();
    private final String endpoint = "http://localhost:5000/latest-data";
    private VehicleRepository vehicleRepository;

    @Autowired
    public VehicleDataFetcher(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

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

                        if( vehicleRepository.findByVehicleId( v.getId() ) == null )
                        {
                            vehicleRepository.addVehicle(v);
                        }
                        else {
                            vehicleRepository.deleteVehicleById( v.getId() );
                            vehicleRepository.addVehicle(v);
                        }
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


    public Vehicle convertToVehicle(JsonNode data) {
        Vehicle vehicle = new Vehicle();

        // 基础信息
        String vehicleId = data.path("vehicle_id").asText("UNKNOWN");
        vehicle.setVehicleId(vehicleId);
        vehicle.setLicensePlate(vehicleId); // 如果没有真实车牌号，用 vehicleId 填充
        vehicle.setCarModel("Simulated Model"); // 真实项目可通过规则映射
        vehicle.setYear(2025); // 可配置或动态设定
        vehicle.setEnergyType("electric");

        // GPS 位置信息
        JsonNode gps = data.path("sensors").path("gps");
        vehicle.setLatitude(gps.path("latitude").asDouble());
        vehicle.setLongitude(gps.path("longitude").asDouble());
        vehicle.setSpeed(gps.path("speed").asDouble());

        // 电池信息
        JsonNode battery = data.path("battery");
        vehicle.setLeftoverEnergy((int) battery.path("soc").asDouble());

        // 温度、电压、电流映射到其他字段
        vehicle.setLubeOilTemp(battery.path("temperature").asDouble());     // 电池温度 → 近似润滑油温
        vehicle.setFuelPressure(battery.path("voltage").asDouble());        // 电压
        vehicle.setCoolantPressure(battery.path("current").asDouble());     // 电流

        // 电机信息
        JsonNode motor = data.path("motor");
        vehicle.setEngineRPM(motor.path("rpm").asInt());
        vehicle.setCoolantTemp(motor.path("temperature").asDouble());
        vehicle.setLubeOilPressure(motor.path("load").asDouble()); // 使用电机负载

        // 引擎状态（默认）
        vehicle.setEngineCondition(0);

        // 连接/任务/健康状态（可根据其他数据扩展判断）
        vehicle.setConnectionStatus(1);
        vehicle.setTaskStatus(0);
        vehicle.setHealthStatus(1);

        // 可选模拟：雷达/摄像头/IP
        vehicle.setRadarModel("simRadar");
        vehicle.setRadarCount(2);
        vehicle.setCameraModel("simCamera");
        vehicle.setCameraCount(2);
        vehicle.setIpAddress("127.0.0.1");

        // 尺寸（如果模拟车辆结构一致）
        vehicle.setLength(4.5);
        vehicle.setWidth(1.8);
        vehicle.setHeight(1.6);

        return vehicle;
    }

}




