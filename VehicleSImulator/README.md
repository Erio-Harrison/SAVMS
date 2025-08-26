# 车辆模拟器系统 (Vehicle Simulator)

这是一个基于Python的车辆模拟器系统，用于模拟多辆车的实时数据并同步到MongoDB云数据库。每辆车在独立的线程中运行，每5秒更新一次数据到数据库。

## 功能特性

- 🚗 **多车辆模拟**: 支持同时模拟多辆车辆
- 🧵 **多线程架构**: 每辆车在独立线程中运行，互不干扰
- 🗄️ **MongoDB集成**: 实时同步数据到MongoDB云数据库
- 📊 **实时数据更新**: 每5秒更新一次车辆状态数据
- 🎛️ **交互式管理**: 提供命令行界面进行管理
- 📝 **完整日志**: 详细的运行日志和状态监控
- 🔧 **灵活配置**: 支持环境变量和配置文件

## 数据模型

根据您的MongoDB数据库结构，每辆车包含以下数据：

### 基本信息
- `licensePlate`: 车牌号
- `carModel`: 车型
- `year`: 年份
- `energyType`: 能源类型（电动/混合/汽油）

### 物理属性
- `length`, `width`, `height`: 车辆尺寸

### 设备信息
- `radarModel`, `radarCount`: 雷达型号和数量
- `cameraModel`, `cameraCount`: 摄像头型号和数量

### 实时数据
- `longitude`, `latitude`: 经纬度坐标
- `location`: GeoJSON格式的位置信息
- `speed`: 当前速度
- `leftoverEnergy`: 剩余能量
- `engineRPM`: 发动机转速
- 各种传感器数据（油压、水温等）
- 连接状态、任务状态、健康状态

## 安装和配置

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 配置MongoDB连接

复制环境变量示例文件：
```bash
cp .env.example .env
```

编辑 `.env` 文件，设置您的MongoDB连接信息：
```env
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/
DATABASE_NAME=123
COLLECTION_NAME=vehicle
```

### 3. 配置参数（可选）

在 `config.py` 中可以调整以下参数：
- `UPDATE_INTERVAL`: 数据更新间隔（默认5秒）
- `VEHICLE_COUNT`: 模拟车辆数量（默认2辆）
- 传感器数据范围
- 地理位置范围

## 使用方法

### 交互模式（推荐）

```bash
python main.py interactive
```

交互模式支持以下命令：
- `start`: 启动所有车辆模拟
- `stop`: 停止所有车辆模拟
- `status`: 显示状态报告
- `clear`: 清空数据库中的所有车辆数据
- `quit`: 退出程序

### 连续运行模式

```bash
python main.py continuous
```

启动后自动开始模拟，按 Ctrl+C 停止。

### 测试模式

```bash
python main.py test
```

运行30秒的测试，验证系统功能。

### 命令行选项

```bash
python main.py --help
```

可用选项：
- `--debug`: 启用详细调试日志
- `--vehicles N`: 指定模拟车辆数量

## 系统架构

```
main.py                 # 程序入口
├── SimulatorManager    # 模拟器管理器
│   ├── DatabaseManager # 数据库管理
│   └── VehicleSimulator[] # 车辆模拟器数组
│       └── VehicleModel   # 车辆数据模型
└── Config              # 配置管理
```

### 核心组件

1. **SimulatorManager**: 管理所有车辆模拟器，处理启动/停止/状态监控
2. **VehicleSimulator**: 单个车辆的模拟器，在独立线程中运行
3. **VehicleModel**: 车辆数据模型，负责生成模拟数据
4. **DatabaseManager**: MongoDB数据库操作封装

### 线程模型

- 主线程：用户交互和管理
- 车辆线程：每辆车一个独立线程，负责数据生成和更新

## 数据模拟策略

### 位置模拟
- 基于初始位置进行随机漂移
- 模拟车辆的连续移动轨迹

### 速度模拟
- 在基准速度附近波动
- 符合真实驾驶场景

### 传感器数据
- 在合理范围内随机生成
- 基于基准值进行渐进式变化
- 模拟真实的传感器数据波动

## 日志和监控

### 日志文件
- 自动生成日志文件：`vehicle_simulator_YYYYMMDD.log`
- 包含详细的运行信息和错误记录

### 状态监控
- 实时显示每辆车的运行状态
- 数据库连接状态监控
- 线程运行状态检查

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查 `MONGODB_URI` 是否正确
   - 确认网络连接正常
   - 验证数据库用户权限

2. **线程启动失败**
   - 检查系统资源是否充足
   - 确认没有端口冲突

3. **数据更新失败**
   - 检查数据库写入权限
   - 确认集合名称正确

### 调试模式

使用 `--debug` 参数启用详细日志：
```bash
python main.py --debug
```

## 扩展和定制

### 添加新的传感器数据
在 `VehicleModel.generate_dynamic_data()` 中添加新字段。

### 修改更新频率
在 `config.py` 中修改 `UPDATE_INTERVAL`。

### 自定义车辆数据
在 `SimulatorManager._create_vehicle_simulators()` 中修改车辆信息。

## 性能优化

- 使用线程池减少线程创建开销
- 实现数据库连接池
- 添加数据批量更新功能
- 实现智能的数据变化检测

## 安全注意事项

- 不要在代码中硬编码数据库密码
- 使用环境变量管理敏感信息
- 定期更新依赖库版本
- 在生产环境中启用SSL连接

## 许可证

本项目仅供学习和研究使用。

## 技术支持

如有问题，请检查日志文件或启用调试模式获取详细信息。 