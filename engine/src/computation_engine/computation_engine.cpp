#include "computation_engine.h"
#include <numeric>
#include <iostream>

ComputationEngine::ComputationEngine() {}

ComputationEngine::~ComputationEngine() {}
std::string ComputationEngine::computeResult(const std::vector<std::string>& processedData) {
    std::cout << "\nPerforming final computation..." << std::endl;

    // 模拟计算一些统计数据
    int totalVehicles = processedData.size();
    double avgSpeed = 0.0;
    double avgPosition = 0.0;

    for (const auto& data : processedData) {
        // 简单的模拟计算
        avgSpeed += 35.0;  // 假设平均速度
        avgPosition += 2.5; // 假设平均位置
    }

    avgSpeed /= totalVehicles;
    avgPosition /= totalVehicles;

    std::string result = "Fleet Analysis Result:\n"
        "- Total Vehicles: " + std::to_string(totalVehicles) + "\n"
        "- Average Speed: " + std::to_string(avgSpeed) + " km/h\n"
        "- Average Position: (" + std::to_string(avgPosition) + ", " + std::to_string(avgPosition) + ")\n"
        "- Fleet Status: Normal\n"
        "- System Time: " + std::to_string(time(nullptr));

    std::cout << "\n=== Final Computation Result ===\n" << result << "\n" << std::endl;
    return result;
}