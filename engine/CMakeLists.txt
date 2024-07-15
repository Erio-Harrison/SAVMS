cmake_minimum_required(VERSION 3.10)
project(SAVMS)

set(CMAKE_CXX_STANDARD 17)

# 找到JNI
find_package(JNI REQUIRED)
include_directories(${JNI_INCLUDE_DIRS})

# 包含头文件目录
include_directories(include)
include_directories(src/data_collector)
include_directories(src/data_processor)
include_directories(src/computation_engine)
include_directories(src/jni_interface)

# 添加源文件
set(SOURCES
    src/data_collector/data_collector.cpp
    src/data_processor/data_processor.cpp
    src/computation_engine/computation_engine.cpp
    src/jni_interface/com_example_dataprocessing_service_DataProcessingService.cpp
)

# 明确指定创建共享库
add_library(dataprocessing SHARED ${SOURCES})

# 链接JNI库
target_link_libraries(dataprocessing ${JNI_LIBRARIES})

# 设置输出目录
set_target_properties(dataprocessing PROPERTIES
    LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib
    RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib  # 为Windows DLL文件设置
    ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib  # 为静态库设置
)

# 为 macOS 设置特定的 .dylib 输出目录
if(APPLE)
    set_target_properties(dataprocessing PROPERTIES
        LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib
    )
endif()

# 打印库文件位置
add_custom_command(TARGET dataprocessing POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E echo 
    "Library built at: $<TARGET_FILE:dataprocessing>"
)