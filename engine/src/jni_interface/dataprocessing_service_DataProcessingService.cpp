#include "dataprocessing_service_DataProcessingService.h"
#include "../data_collector/data_collector.h"
#include "../data_processor/data_processor.h"
#include "../computation_engine/computation_engine.h"
#include <string>
#include <vector>

JNIEXPORT jstring JNICALL Java_com_savms_service_DataProcessingService_processDataNative
  (JNIEnv *env, jobject, jstring jInput) {
    const char *input = env->GetStringUTFChars(jInput, 0);
    std::string dataSource(input);
    env->ReleaseStringUTFChars(jInput, input);

    DataCollector collector;
    DataProcessor processor;
    ComputationEngine engine;

    // 采集数据
    collector.connect(dataSource);
    std::vector<std::string> rawData = collector.collectData(10);
    collector.disconnect();

    // 处理数据
    std::vector<std::string> processedData = processor.processData(rawData);

    // 计算结果
    std::string result = engine.computeResult(processedData);

    return env->NewStringUTF(result.c_str());
}