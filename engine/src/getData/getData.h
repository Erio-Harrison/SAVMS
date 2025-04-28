//#ifndef GET_DATA_H
//#define GET_DATA_H
//
//#include <string>
//#include <vector>
//
//class GetData {
//public:
//    GetData();
//    ~GetData();
//
//    bool connect(const std::string& source);
//    std::vector<std::string> collectData(int batchSize);
//    void disconnect();
//
//private:
//    bool isConnected;
//};
//
//#endif

#ifndef GETDATA_H
#define GETDATA_H

#include <string>
#include <vector>
#include <stdexcept>

// Simple struct to store vehicle data
struct VehicleInfo {
    std::string vehicleId;
    double speed;
    double latitude;
    double longitude;
    // ...other fields as needed...
};

class GetData {
public:
    GetData();
    ~GetData();

    /**
     * Fetches the latest-data JSON from simulator_sender’s REST API
     * and returns a list of VehicleInfo objects.
     *
     * @param url The endpoint to retrieve data from (e.g. http://localhost:5000/latest-data).
     * @return A vector of VehicleInfo objects extracted from JSON.
     */
    std::vector<VehicleInfo> getOnlineData(const std::string& url);

private:
    // Helper function to perform HTTP GET using libcurl
    std::string httpGet(const std::string& url);
};

#endif
