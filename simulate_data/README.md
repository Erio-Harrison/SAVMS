# SAVMS 数据模拟系统

这是Smart Autonomous Vehicle Management System (SAVMS) 项目的数据模拟系统，用于生成和接收模拟的车辆遥测数据和异常事件。该系统由两个Python脚本组成，一个负责模拟数据生成，另一个负责数据接收和显示。

## 文件结构

- `simulator_sender.py` - 数据模拟器，用于生成车辆遥测数据和异常事件
- `simulator_receive.py` - 数据接收器，用于接收和显示模拟数据

## 安装依赖

该系统仅需几个Python标准库和一个第三方库：

```bash
pip install watchdog
```

watchdog库用于监视文件系统变化，接收器使用它来检测新的数据批次。

## 使用方法

### 步骤1：启动数据模拟器

在一个终端中运行数据模拟器：

```bash
python simulator_sender.py
```

### 步骤2：启动数据接收器

在另一个终端中运行数据接收器：

```bash
python simulator_receive.py
```

如果需要查看详细的遥测数据，可以启用详细模式：

```bash
python simulator_receive.py --verbose
```

## 模拟器参数说明

数据模拟器支持以下命令行参数：

- `--output` - 指定输出目录，默认为 `savms_data`
- `--rate` - 指定数据生成间隔(毫秒)，默认为 `1000`
- `--anomaly-prob` - 指定异常事件生成概率百分比，默认为 `5`
- `--speed` - 指定模拟速度倍率，默认为 `1`

例如，以下命令将以500毫秒的间隔生成数据，异常概率设为10%，模拟速度为实时的10倍：

```bash
python simulator_sender.py --rate 500 --anomaly-prob 10 --speed 10
```

## 接收器参数说明

数据接收器支持以下命令行参数：

- `--input` - 指定输入目录，默认为 `savms_data`
- `--verbose` 或 `-v` - 启用详细输出模式，显示所有遥测数据

## 数据格式

该系统生成的数据使用JSON格式，存储在以下目录结构中：

```
savms_data/
├── live/                      # 实时数据（最新状态）
│   ├── telemetry.json        # 所有车辆的最新状态
│   └── anomaly.json          # 最新的异常事件
│
├── batch_0/                   # 历史数据批次
│   ├── telemetry.json        # 该批次的车辆数据
│   └── anomaly.json          # 该批次的异常事件
│
├── batch_1/
...
```

### 遥测数据格式

遥测数据包含车辆的完整状态信息：

```json
{
  "vehicle_id": "V001",
  "timestamp": 1647245678901,
  "data_type": "telemetry",
  "mode": "cruising",
  "battery": {
    "soc": 85.3,
    "temperature": 32.6,
    "cycle_count": 157,
    "voltage": 390.5,
    "current": -45.2
  },
  "motor": {
    "temperature": 45.3,
    "efficiency": 92.1,
    "load": 50.2,
    "rpm": 3000,
    "torque": 120.5
  },
  "sensors": {
    "acceleration": {
      "x": 0.12,
      "y": -0.05,
      "z": 9.8
    },
    "gps": {
      "latitude": 39.9042,
      "longitude": 116.4074,
      "altitude": 48.6,
      "speed": 65.8,
      "heading": 120.5
    },
    "gyroscope": {
      "x": 0.01,
      "y": 0.03,
      "z": -0.02
    }
  }
}
```

### 异常事件格式

异常事件数据示例：

```json
{
  "vehicle_id": "V001",
  "timestamp": 1647245679012,
  "data_type": "anomaly",
  "anomaly_type": "motor",
  "details": {
    "temperature": 85.3,
    "efficiency_drop": 12.5,
    "vibration": 8.7,
    "severity": 2
  }
}
```

## 故障排除

如果遇到文件读写错误，可能是由于文件系统的竞争条件导致的。尝试以下解决方法：

1. 确保数据接收器的启动时间晚于数据模拟器
2. 降低数据生成速率（增加`--rate`参数）
3. 确保输出目录存在且有写入权限
4. 如果在Windows上遇到权限问题，请以管理员身份运行

## 集成到SpringBoot项目

要将这个模拟系统集成到SpringBoot项目中，可以：

1. 保持模拟器Python脚本不变，生成数据文件
2. 在SpringBoot项目中实现类似的文件监视逻辑来读取数据
3. 将数据转换为Java对象并进行进一步处理

参考`VehicleDataService.java`类作为在SpringBoot中读取模拟数据的实现示例。