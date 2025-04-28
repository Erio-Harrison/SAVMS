// 头文件 (interface.h)
#ifndef COM_SAVMS_SERVICE_INTERFACE_H
#define COM_SAVMS_SERVICE_INTERFACE_H

#include <jni.h>

#ifdef __cplusplus
extern "C" {
#endif

JNIEXPORT jstring JNICALL Java_com_savms_service_DataProcessingService_processDataNative
  (JNIEnv *, jobject, jstring);

#ifdef __cplusplus
}
#endif

#endif