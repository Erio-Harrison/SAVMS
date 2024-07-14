#ifndef DATA_COLLECTOR_H
#define DATA_COLLECTOR_H

#include <string>
#include <vector>

class DataCollector {
public:
    DataCollector();
    ~DataCollector();

    bool connect(const std::string& source);
    std::vector<std::string> collectData(int batchSize);
    void disconnect();

private:
    // 添加任何必要的私有成员
    bool isConnected;
};

#endif // DATA_COLLECTOR_H