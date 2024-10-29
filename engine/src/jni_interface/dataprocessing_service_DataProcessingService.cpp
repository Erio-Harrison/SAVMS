#include "dataprocessing_service_DataProcessingService.h"
#include "../data_collector/data_collector.h"
#include "../data_processor/data_processor.h"
#include "../computation_engine/computation_engine.h"
#include <string>
#include <vector>
#include <iostream>

JNIEXPORT jstring JNICALL Java_com_savms_service_DataProcessingService_processDataNative
  (JNIEnv *env, jobject, jstring jInput) {
    const char *input = env->GetStringUTFChars(jInput, 0);
    std::string dataSource(input);
    env->ReleaseStringUTFChars(jInput, input);

    std::cout << "\n====== Starting Data Processing Pipeline ======\n" << std::endl;

    DataCollector collector;
    DataProcessor processor;
    ComputationEngine engine;

    try {
        std::cout << "Initializing connection to: " << dataSource << std::endl;
        collector.connect(dataSource);

        std::cout << "\nStarting data collection phase..." << std::endl;
        std::vector<std::string> rawData = collector.collectData(5);  // 采集5辆车的数据
        collector.disconnect();

        std::vector<std::string> processedData = processor.processData(rawData);
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