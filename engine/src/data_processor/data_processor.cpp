#include "data_processor.h"
#include <algorithm>
#include <iostream>

DataProcessor::DataProcessor() {}

DataProcessor::~DataProcessor() {}

std::vector<std::string> DataProcessor::processData(const std::vector<std::string>& rawData) {
    std::vector<std::string> processedData;

    for (const auto& data : rawData) {
        // 实现数据处理逻辑，这里只是一个简单的示例
        std::string processed = data + " - processed";
        processedData.push_back(processed);
    }

    std::cout << "Processed " << processedData.size() << " data points" << std::endl;
    return processedData;
}