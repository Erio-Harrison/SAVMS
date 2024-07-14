#include "computation_engine.h"
#include <numeric>
#include <iostream>

ComputationEngine::ComputationEngine() {}

ComputationEngine::~ComputationEngine() {}

std::string ComputationEngine::computeResult(const std::vector<std::string>& processedData) {
    // 实现核心计算逻辑，这里只是一个简单的示例
    int totalLength = std::accumulate(processedData.begin(), processedData.end(), 0,
        [](int sum, const std::string& s) { return sum + s.length(); });

    std::string result = "Computed result: Total length of processed data = " + std::to_string(totalLength);
    std::cout << result << std::endl;
    return result;
}