#ifndef GET_DATA_H
#define GET_DATA_H

#include <string>
#include <vector>

class GetData {
public:
    GetData();
    ~GetData();

    bool connect(const std::string& source);
    std::vector<std::string> collectData(int batchSize);
    void disconnect();

private:
    bool isConnected;
};

#endif