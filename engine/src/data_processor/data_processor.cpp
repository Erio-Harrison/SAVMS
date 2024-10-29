#include "data_processor.h"
#include <algorithm>
#include <iostream>

DataProcessor::DataProcessor() {}

DataProcessor::~DataProcessor() {}

std::vector<std::string> DataProcessor::processData(const std::vector<std::string>& rawData) {
    std::vector<std::string> processedData;
    std::cout << "\nProcessing vehicle data..." << std::endl;

    for (const auto& data : rawData) {
        // 模拟数据处理，添加分析结果
        std::string processed = data + " | Analysis: "
            + "Status=Normal, "
            + "FuelLevel=85%, "
            + "NextService=2000km";
        processedData.push_back(processed);
        std::cout << "Processed: " << processed << std::endl;
    }

    std::cout << "\n=== Processed " << processedData.size() << " data entries ===\n" << std::endl;
    return processedData;
}