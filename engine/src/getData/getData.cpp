#include "getData.h"
#include <iostream>

GetData::GetData() : isConnected(false) {}

GetData::~GetData() {
    if (isConnected) {
        disconnect();
    }
}

bool GetData::connect(const std::string& source) {
    std::cout << "Connecting to data source: " << source << std::endl;
    isConnected = true;
    return isConnected;
}

std::vector<std::string> GetData::collectData(int batchSize) {
    if (!isConnected) {
        throw std::runtime_error("Not connected to data source");
    }

    std::vector<std::string> collectedData;
    for (int i = 0; i < batchSize; ++i) {
        std::string vehicleData = "Vehicle_" + std::to_string(i) + ": "
            + "Position(x=" + std::to_string(i * 1.5)
            + ", y=" + std::to_string(i * 2.0) + ") "
            + "Speed=" + std::to_string(30 + i * 2) + "km/h "
            + "Direction=" + std::to_string(45 + i * 10) + "deg";
        collectedData.push_back(vehicleData);
        std::cout << "Collected: " << vehicleData << std::endl;
    }

    std::cout << "\n=== Collected " << collectedData.size() << " vehicle data points ===\n" << std::endl;
    return collectedData;
}

void GetData::disconnect() {
    if (isConnected) {
        std::cout << "Disconnecting from data source" << std::endl;
        isConnected = false;
    }
}