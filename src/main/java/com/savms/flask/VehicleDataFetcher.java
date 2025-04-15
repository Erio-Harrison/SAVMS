package com.savms.flask;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.savms.entity.Vehicle;
import com.savms.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Iterator;
import java.util.Map;



public class VehicleDataFetcher implements Runnable {
    private final HttpClient client = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();
    private final String endpoint = "http://localhost:5000/latest-data";
    private VehicleRepository vehicleRepository;

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

            vehicle.setLicensePlate(data.path("vehicle_id").asText("UNKNOWN"));
            vehicle.setCarModel("Simulated Vehicle");  // Default or logic to map actual model
            vehicle.setYear(2020);  // Set default or extract if available
            vehicle.setEnergyType("electric");  // Hardcoded or extracted if available

            // Location
            JsonNode gps = data.path("sensors").path("gps");
            Vehicle.Location location = new Vehicle.Location();
            location.setLatitude(gps.path("latitude").asDouble());
            location.setLongitude(gps.path("longitude").asDouble());
            vehicle.setLocation(location);

            // Speed
            vehicle.setSpeed(gps.path("speed").asDouble());

            // Battery
            JsonNode battery = data.path("battery");
            vehicle.setLeftoverEnergy((int) battery.path("soc").asDouble());
            vehicle.setLubeOilTemp(battery.path("temperature").asDouble());  // Approximation
            vehicle.setFuelPressure(battery.path("voltage").asDouble());     // Repurposed
            vehicle.setCoolantPressure(battery.path("current").asDouble());  // Repurposed

            // Motor
            JsonNode motor = data.path("motor");
            vehicle.setEngineRPM(motor.path("rpm").asInt());
            vehicle.setCoolantTemp(motor.path("temperature").asDouble());
            vehicle.setLubeOilPressure(motor.path("load").asDouble());  // Repurposed
            vehicle.setEngineCondition(0);  // 0 = normal (you can change logic here)

            // Default values for unused properties
            vehicle.setConnectionStatus(1);
            vehicle.setTaskStatus(1);
            vehicle.setHealthStatus(0);

            // Optional nested fields
            vehicle.setRadar(new Vehicle.Sensor("simRadar", 2));
            vehicle.setCamera(new Vehicle.Sensor("simCamera", 2));
            vehicle.setCommunication(new Vehicle.Communication("127.0.0.1"));
            vehicle.setSize(new Vehicle.Size(4.5, 1.8, 1.6));

            return vehicle;
        }
    }




