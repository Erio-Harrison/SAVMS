#ifndef DATA_PROCESSOR_H
#define DATA_PROCESSOR_H

#include <vector>
#include <string>

class DataProcessor {
public:
    DataProcessor();
    ~DataProcessor();

    std::vector<std::string> processData(const std::vector<std::string>& rawData);

private:
    // 添加任何必要的私有成员
};

#endif // DATA_PROCESSOR_H