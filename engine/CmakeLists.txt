cmake_minimum_required(VERSION 3.10)

project(SAVMS)

set(CMAKE_CXX_STANDARD 17)

# 设置 Java 最低版本要求
set(JAVA_VERSION_REQUIRED "17")

# 允许用户自定义 JAVA_HOME
if(NOT DEFINED ENV{JAVA_HOME})
    message(STATUS "JAVA_HOME not set, attempting to find Java automatically")
else()
    set(JAVA_HOME $ENV{JAVA_HOME})
    message(STATUS "Using JAVA_HOME: ${JAVA_HOME}")
endif()

# 查找 Java
find_package(Java ${JAVA_VERSION_REQUIRED} REQUIRED)
if(Java_FOUND)
    message(STATUS "Found Java: ${Java_VERSION}")
else()
    message(FATAL_ERROR "Java ${JAVA_VERSION_REQUIRED} or higher not found")
endif()

# 手动指定 JNI 路径
set(JNI_INCLUDE_DIRS
    "${JAVA_HOME}/include"
    "${JAVA_HOME}/include/win32"
)
set(JNI_LIBRARIES "${JAVA_HOME}/lib/jvm.lib")
set(JNI_FOUND TRUE)

# 检查 JNI 路径是否存在
foreach(dir ${JNI_INCLUDE_DIRS})
    if(NOT EXISTS "${dir}")
        message(FATAL_ERROR "JNI include directory not found: ${dir}")
    endif()
endforeach()
if(NOT EXISTS "${JNI_LIBRARIES}")
    message(FATAL_ERROR "JNI library not found: ${JNI_LIBRARIES}")
endif()

message(STATUS "Using manually specified JNI: ${JNI_INCLUDE_DIRS}")

include_directories(${JNI_INCLUDE_DIRS})

# 包含头文件目录
include_directories(include)
include_directories(src/data_collector)
include_directories(src/data_processor)
include_directories(src/computation_engine)
include_directories(src/jni_interface)

# 添加源文件
set(SOURCES
    src/getData/getData.cpp
    src/handleData/handleData.cpp
    src/resultData/resultData.cpp
    src/interface/interface.cpp
)

# 创建共享库
add_library(dataprocessing SHARED ${SOURCES})

# 链接JNI库
target_link_libraries(dataprocessing ${JNI_LIBRARIES})

# 设置输出目录
set_target_properties(dataprocessing PROPERTIES
    LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib
    RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib
    ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib
)

# 打印库文件位置
add_custom_command(TARGET dataprocessing POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E echo
    "Library built at: $<TARGET_FILE:dataprocessing>"
)
