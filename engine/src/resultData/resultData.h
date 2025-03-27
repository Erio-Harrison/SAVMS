#ifndef RESULT_DATA_H
#define RESULT_DATA_H

#include <vector>
#include <string>

class ResultData {
public:
    ResultData();
    ~ResultData();

    std::string computeResult(const std::vector<std::string>& processedData);

private:
    // 添加任何必要的私有成员
};
#endif