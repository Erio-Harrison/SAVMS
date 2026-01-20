# iOS BackendAPIService 使用说明

## 概述
`BackendAPIService` 是连接iOS应用与Spring Boot后端API的服务类，替代了原有的Firebase数据库。

## 基本配置
- **服务器地址**: `http://localhost:8080`
- **单例模式**: 使用 `BackendAPIService.shared`

## 1. 登录功能

### 方法签名
```swift
func signInWithUsername(
    username: String,
    password: String,
    role: String,  // "admin" 或 "client"
    completion: @escaping (Result<LoginResponse, APIError>) -> Void
)
```

### 使用示例
```swift
BackendAPIService.shared.signInWithUsername(
    username: "testuser",
    password: "123456",
    role: "admin"
) { result in
    switch result {
    case .success(let loginResponse):
        print("登录成功: \(loginResponse.username)")
        print("Token: \(loginResponse.token)")
    case .failure(let error):
        print("登录失败: \(error.localizedDescription)")
    }
}
```

### 返回数据
**成功时 - LoginResponse:**
- `token`: JWT认证令牌
- `id`: 用户ID
- `username`: 用户名
- `email`: 邮箱
- `role`: 角色 (0=admin, 1=client)

## 2. 车辆数据API

### 获取所有车辆
```swift
BackendAPIService.shared.getAllVehicles { result in
    switch result {
    case .success(let vehicles):
        print("获取到 \(vehicles.count) 辆车辆")
        for vehicle in vehicles {
            print("\(vehicle.licensePlate) - \(vehicle.carModel)")
        }
    case .failure(let error):
        print("错误: \(error.localizedDescription)")
    }
}
```

### 根据ID获取车辆
```swift
BackendAPIService.shared.getVehicle(byId: "车辆ID") { result in
    switch result {
    case .success(let vehicle):
        print("车辆: \(vehicle.licensePlate)")
    case .failure(let error):
        print("错误: \(error.localizedDescription)")
    }
}
```

### 车辆数据字段
**BackendVehicle 包含:**
- `id`: 车辆ID
- `licensePlate`: 车牌号
- `carModel`: 车型  
- `year`: 年份
- `energyType`: 能源类型
- `length/width/height`: 车辆尺寸
- `radarModel/radarCount`: 雷达信息
- `cameraModel/cameraCount`: 摄像头信息
- `ipAddress`: IP地址 (可选)
- `longitude/latitude`: 经纬度
- `location`: GeoJSON位置信息 (可选)
- `speed`: 速度
- `leftoverEnergy`: 剩余电量 (整数百分比)
- `connectionStatus`: 连接状态 (0/1)
- `taskStatus`: 任务状态 (0/1)  
- `healthStatus`: 健康状态 (0/1)
- `engineRPM`: 发动机转速 (整数)
- `lubeOilPressure/fuelPressure/coolantPressure`: 各种压力
- `lubeOilTemp/coolantTemp`: 温度
- `engineCondition`: 引擎状态
- `images`: 车辆图片 (可选)

## 3. 任务数据API

### 获取所有任务
```swift
BackendAPIService.shared.getAllTasks { result in
    switch result {
    case .success(let tasks):
        print("获取到 \(tasks.count) 个任务")
        for task in tasks {
            print("\(task.title) - 状态: \(task.status)")
        }
    case .failure(let error):
        print("错误: \(error.localizedDescription)")
    }
}
```

### 根据状态获取任务
```swift
// 获取进行中的任务 (status = 1)
BackendAPIService.shared.getTasks(byStatus: 1) { result in
    switch result {
    case .success(let tasks):
        print("进行中的任务: \(tasks.count) 个")
    case .failure(let error):
        print("错误: \(error.localizedDescription)")
    }
}
```

### 任务状态说明
- `0`: 未分配
- `1`: 进行中  
- `2`: 已完成
- `3`: 已取消

### 任务数据字段
**BackendTask 包含:**
- `id`: 任务ID
- `title`: 任务标题
- `description`: 任务描述
- `startTime/endTime`: 开始/结束时间 (ISO格式字符串)
- `status`: 任务状态
- `startLocation/endLocation`: 起点/终点位置
- `vehicleLocation`: 车辆当前位置 (可选)
- `startPoint/endPoint`: 起点/终点GeoJSON坐标
- `assignedVehicleId`: 分配的车辆ID (可选)
- `vehicle`: 车辆信息 (车牌号等)

## 4. 错误处理

### APIError 类型
- `invalidURL`: URL无效
- `noData`: 无数据返回
- `networkError(String)`: 网络错误
- `decodingError(String)`: 数据解析错误
- `serverError(String)`: 服务器错误

### 常见错误处理
```swift
BackendAPIService.shared.getAllVehicles { result in
    switch result {
    case .success(let vehicles):
        // 处理成功情况
        break
    case .failure(let error):
        switch error {
        case .networkError(let message):
            print("网络问题: \(message)")
            // 检查网络连接，确保Spring Boot服务器运行在localhost:8080
        case .serverError(let message):
            print("服务器错误: \(message)")
            // 检查API端点和数据格式
        case .decodingError(let message):
            print("数据解析错误: \(message)")
            // 检查数据模型是否与后端API匹配
        default:
            print("其他错误: \(error.localizedDescription)")
        }
    }
}
```

## 5. 测试页面使用

1. **登录应用**
2. **点击左上角菜单按钮** (三条横线图标)
3. **选择"API数据测试"**
4. **使用测试按钮**:
   - "获取所有车辆" - 测试车辆API
   - "获取所有任务" - 测试任务API  
   - "获取进行中的任务" - 测试状态筛选

## 6. 调试提示

- **查看Xcode控制台**: 所有API调用都有详细的日志输出
- **检查网络**: 确保Spring Boot服务器运行在 `localhost:8080`
- **数据库状态**: 确保MongoDB中有测试数据

## 7. 后端API端点参考

- **登录**: `POST /api/auth/login`
- **所有车辆**: `GET /vehicles/get/all`
- **车辆by ID**: `GET /vehicles/get/id/{vehicleId}`
- **所有任务**: `GET /api/tasks/all`
- **任务by状态**: `GET /api/tasks/status/{status}`

---

## 8. 实际使用示例

### 获取并显示车辆信息
```swift
BackendAPIService.shared.getAllVehicles { result in
    switch result {
    case .success(let vehicles):
        for vehicle in vehicles {
            print("🚗 \(vehicle.licensePlate) - \(vehicle.carModel)")
            print("   位置: (\(vehicle.latitude), \(vehicle.longitude))")
            print("   速度: \(vehicle.speed) km/h")
            print("   电量: \(vehicle.leftoverEnergy)%")
            print("   状态: 连接\(vehicle.connectionStatus) 任务\(vehicle.taskStatus) 健康\(vehicle.healthStatus)")
        }
    case .failure(let error):
        print("获取车辆失败: \(error.localizedDescription)")
    }
}
```

### 获取并显示任务信息
```swift
BackendAPIService.shared.getAllTasks { result in
    switch result {
    case .success(let tasks):
        for task in tasks {
            print("📋 \(task.title)")
            print("   描述: \(task.description)")
            print("   状态: \(taskStatusText(task.status))")
            print("   起点: \(task.startLocation.address)")
            print("   终点: \(task.endLocation.address)")
            print("   车牌: \(task.vehicle.plateNumber)")
        }
    case .failure(let error):
        print("获取任务失败: \(error.localizedDescription)")
    }
}

func taskStatusText(_ status: Int) -> String {
    switch status {
    case 0: return "未分配"
    case 1: return "进行中"
    case 2: return "已完成"
    case 3: return "已取消"
    default: return "未知"
    }
}
```

## 9. 数据模型更新记录

**v1.1 (2025-08-31)**
- 修复了车辆数据模型，添加了所有后端字段
- 更新了任务数据模型，匹配后端实际响应格式
- 添加了GeoJSON位置信息支持
- 修复了数据类型问题 (`leftoverEnergy`, `engineRPM` 为整数)

**祝你测试顺利！🚀**