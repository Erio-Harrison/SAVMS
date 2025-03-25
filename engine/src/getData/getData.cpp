#include "data_collector.h"
#include <iostream>

DataCollector::DataCollector() : isConnected(false) {}

DataCollector::~DataCollector() {
    if (isConnected) {
        disconnect();
    }
}

bool DataCollector::connect(const std::string& source) {
    // 实现连接到数据源的逻辑
    std::cout << "Connecting to data source: " << source << std::endl;
    isConnected = true;
    return isConnected;
}

std::vector<std::string> DataCollector::collectData(int batchSize) {
    if (!isConnected) {
        throw std::runtime_error("Not connected to data source");
    }

    // 模拟车辆数据采集
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

void DataCollector::disconnect() {
    if (isConnected) {
        // 实现断开连接的逻辑
        std::cout << "Disconnecting from data source" << std::endl;
        isConnected = false;
    }
}