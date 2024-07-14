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

    // 模拟数据采集
    std::vector<std::string> collectedData;
    for (int i = 0; i < batchSize; ++i) {
        collectedData.push_back("Sample data " + std::to_string(i));
    }

    std::cout << "Collected " << collectedData.size() << " data points" << std::endl;
    return collectedData;
}

void DataCollector::disconnect() {
    if (isConnected) {
        // 实现断开连接的逻辑
        std::cout << "Disconnecting from data source" << std::endl;
        isConnected = false;
    }
}