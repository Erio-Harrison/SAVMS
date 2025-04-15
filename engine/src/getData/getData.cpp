//#include "getData.h"
//#include <iostream>
//
//GetData::GetData() : isConnected(false) {}
//
//GetData::~GetData() {
//    if (isConnected) {
//        disconnect();
//    }
//}
//
//bool GetData::connect(const std::string& source) {
//    std::cout << "Connecting to data source: " << source << std::endl;
//    isConnected = true;
//    return isConnected;
//}
//
//std::vector<std::string> GetData::collectData(int batchSize) {
//    if (!isConnected) {
//        throw std::runtime_error("Not connected to data source");
//    }
//
//    std::vector<std::string> collectedData;
//    for (int i = 0; i < batchSize; ++i) {
//        std::string vehicleData = "Vehicle_" + std::to_string(i) + ": "
//            + "Position(x=" + std::to_string(i * 1.5)
//            + ", y=" + std::to_string(i * 2.0) + ") "
//            + "Speed=" + std::to_string(30 + i * 2) + "km/h "
//            + "Direction=" + std::to_string(45 + i * 10) + "deg";
//        collectedData.push_back(vehicleData);
//        std::cout << "Collected: " << vehicleData << std::endl;
//    }
//
//    std::cout << "\n=== Collected " << collectedData.size() << " vehicle data points ===\n" << std::endl;
//    return collectedData;
//}
//
//void GetData::disconnect() {
//    if (isConnected) {
//        std::cout << "Disconnecting from data source" << std::endl;
//        isConnected = false;
//    }
//}

#include "getData.h"
#include <iostream>
#include <curl/curl.h>
// Include your preferred JSON library; here we assume nlohmann/json
#include <nlohmann/json.hpp>

using json = nlohmann::json;

/**
 * Callback function for libcurl to write received data into a std::string.
 */
static size_t WriteCallback(void* contents, size_t size, size_t nmemb, void* userp)
{
    // Total bytes = size * nmemb
    size_t totalSize = size * nmemb;
    std::string* str = static_cast<std::string*>(userp);
    str->append(static_cast<char*>(contents), totalSize);
    return totalSize;
}

GetData::GetData()
{
    // Could initialize any data structures here if needed
}

GetData::~GetData()
{
    // Cleanup if necessary
}

std::string GetData::httpGet(const std::string& url)
{
    CURL* curl = curl_easy_init();
    if (!curl) {
        throw std::runtime_error("Failed to initialize CURL");
    }

    std::string response;
    CURLcode res;

    curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
    curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);  // Follow redirects if needed
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);

    // Optionally set a timeout, e.g. 10 seconds
    curl_easy_setopt(curl, CURLOPT_TIMEOUT, 10L);

    // Perform the request
    res = curl_easy_perform(curl);

    if (res != CURLE_OK) {
        curl_easy_cleanup(curl);
        throw std::runtime_error(std::string("CURL error: ") + curl_easy_strerror(res));
    }

    curl_easy_cleanup(curl);
    return response;
}

std::vector<VehicleInfo> GetData::getOnlineData(const std::string& url)
{
    // Make the HTTP GET request to fetch raw JSON
    std::string rawJson = httpGet(url);

    // Parse the JSON
    json j;
    try {
        j = json::parse(rawJson);
    }
    catch (const json::parse_error& e) {
        throw std::runtime_error(std::string("JSON parse error: ") + e.what());
    }

    // The simulator’s /latest-data JSON might look like:
    // {
    //   "telemetry": {
    //       "V001": { ...fields... },
    //       "V002": { ...fields... },
    //       ...
    //   },
    //   "anomaly": [ ... ]
    // }
    //
    // We'll extract from `telemetry` to fill VehicleInfo structs.

    std::vector<VehicleInfo> vehicles;

    if (j.contains("telemetry") && j["telemetry"].is_object()) {
        auto telemetryObj = j["telemetry"];

        for (auto it = telemetryObj.begin(); it != telemetryObj.end(); ++it) {
            // it.key() = "V001", it.value() = { JSON object with data }
            std::string vehicleId = it.key();
            auto vehicleData = it.value();

            // Create a VehicleInfo object
            VehicleInfo info;
            info.vehicleId = vehicleId;

            // The structure depends on what your JSON actually contains:
            // e.g. speed: telemetry["sensors"]["gps"]["speed"]
            if (vehicleData.contains("sensors") && vehicleData["sensors"].contains("gps")) {
                auto gpsData = vehicleData["sensors"]["gps"];

                // Speed
                if (gpsData.contains("speed") && gpsData["speed"].is_number()) {
                    info.speed = gpsData["speed"].get<double>();
                }

                // Latitude
                if (gpsData.contains("latitude") && gpsData["latitude"].is_number()) {
                    info.latitude = gpsData["latitude"].get<double>();
                }

                // Longitude
                if (gpsData.contains("longitude") && gpsData["longitude"].is_number()) {
                    info.longitude = gpsData["longitude"].get<double>();
                }
            }

            vehicles.push_back(info);
        }
    }

    // Print out what we found (similar to original approach)
    std::cout << "\n=== Retrieved " << vehicles.size() << " vehicles from " << url << " ===\n";
    for (const auto& v : vehicles) {
        std::cout << "Vehicle: " << v.vehicleId
                  << " | Speed: " << v.speed
                  << " | Loc: (" << v.latitude << ", " << v.longitude << ")\n";
    }
    std::cout << "===========================================\n" << std::endl;

    return vehicles;
}
