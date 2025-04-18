//#include "interface.h"
//#include "../getData/getData.h"
//#include "../handleData/handleData.h"
//#include "../resultData/resultData.h"
//#include <string>
//#include <vector>
//#include <iostream>
//
//JNIEXPORT jstring JNICALL Java_com_savms_service_DataProcessingService_processDataNative
//  (JNIEnv *env, jobject, jstring jInput) {
//    const char *input = env->GetStringUTFChars(jInput, 0);
//    std::string dataSource(input);
//    env->ReleaseStringUTFChars(jInput, input);
//
//    std::cout << "\n====== Starting Data Processing Pipeline ======\n" << std::endl;
//
//    GetData collector;
//    HandleData processor;
//    ResultData engine;
//
//    try {
//        std::cout << "Initializing connection to: " << dataSource << std::endl;
//        collector.connect(dataSource);
//
//        std::cout << "\nStarting data collection phase..." << std::endl;
//        std::vector<std::string> rawData = collector.collectData(5);
//        collector.disconnect();
//
//        std::vector<std::string> processedData = processor.processData(rawData);
//        std::string result = engine.computeResult(processedData);
//
//        std::cout << "\n====== Data Processing Pipeline Completed ======\n" << std::endl;
//        return env->NewStringUTF(result.c_str());
//    }
//    catch (const std::exception& e) {
//        std::string error = "Error in processing pipeline: " + std::string(e.what());
//        std::cout << "\nERROR: " << error << std::endl;
//        return env->NewStringUTF(error.c_str());
//    }
//}

#include "interface.h"
#include "../getData/getData.h"
#include "../handleData/handleData.h"
#include "../resultData/resultData.h"
#include <string>
#include <vector>
#include <iostream>

JNIEXPORT jstring JNICALL Java_com_savms_service_DataProcessingService_processDataNative
(JNIEnv *env, jobject, jstring jInput) {
    const char *input = env->GetStringUTFChars(jInput, 0);
    std::string dataSource(input);
    env->ReleaseStringUTFChars(jInput, input);

    std::cout << "\n====== Starting Data Processing Pipeline ======\n" << std::endl;

    GetData collector;
    HandleData processor;
    ResultData engine;

    try {
        std::cout << "Fetching data from: " << dataSource << std::endl;
        std::vector<VehicleInfo> vehicles = collector.getOnlineData(dataSource);

        std::vector<std::string> processedData;
        for (const auto& v : vehicles) {
            // Convert each VehicleInfo into a JSON-like string or format needed by your processor
            std::string entry = "Vehicle: " + v.vehicleId +
                ", Speed: " + std::to_string(v.speed) +
                ", Lat: " + std::to_string(v.latitude) +
                ", Lon: " + std::to_string(v.longitude);
            processedData.push_back(entry);
        }

        std::string result = engine.computeResult(processedData);

        std::cout << "\n====== Data Processing Pipeline Completed ======\n" << std::endl;
        return env->NewStringUTF(result.c_str());
    }
    catch (const std::exception& e) {
        std::string error = "Error in processing pipeline: " + std::string(e.what());
        std::cout << "\nERROR: " << error << std::endl;
        return env->NewStringUTF(error.c_str());
    }
}
