#ifndef HANDLE_DATA_H
#define HANDLE_DATA_H

#include <vector>
#include <string>

class HandleData {
public:
    HandleData();
    ~HandleData();

    std::vector<std::string> processData(const std::vector<std::string>& rawData);

private:
    // 添加任何必要的私有成员
};

#endif