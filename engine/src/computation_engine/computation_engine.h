#ifndef COMPUTATION_ENGINE_H
#define COMPUTATION_ENGINE_H

#include <vector>
#include <string>

class ComputationEngine {
public:
    ComputationEngine();
    ~ComputationEngine();

    std::string computeResult(const std::vector<std::string>& processedData);

private:
    // 添加任何必要的私有成员
};

#endif // COMPUTATION_ENGINE_H