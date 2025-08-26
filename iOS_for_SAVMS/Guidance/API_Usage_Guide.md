# SAVMS API 使用指南

## 概述

SAVMS 项目使用 Firebase Firestore 作为数据库，通过自定义的 `AuthService` 类提供用户认证和数据获取功能。

## 项目结构

```
SAVMS/
├── Services/
│   └── DB_API.swift           # API服务类
├── Views/
│   ├── ContentView.swift      # 登录界面
│   └── MainTabView.swift      # 主界面
└── GoogleService-Info.plist   # Firebase配置
```

## API 服务类详解

### AuthService 类 (`Services/DB_API.swift`)

#### 基本配置
```swift
import Foundation
import FirebaseFirestore

class AuthService {
    static let shared = AuthService()
    private let db = Firestore.firestore()
}
```

#### 主要方法

##### 1. 用户登录验证
```swift
func signInWithUsername(
    username: String, 
    password: String, 
    role: String, 
    completion: @escaping (Result<Void, Error>) -> Void
)
```

**参数说明：**
- `username`: 用户名
- `password`: 密码  
- `role`: 用户角色 ("client" 或 "admin")
- `completion`: 回调闭包，返回成功或失败结果

**工作流程：**
1. 使用 `name` 和 `role` 字段查询 Firestore
2. 手动验证密码（支持字符串、整数、浮点数类型）
3. 返回验证结果

## 数据库结构

### users 集合
```json
{
  "name": "ABC",           // 用户名
  "password": 123,         // 密码（可以是字符串或数字）
  "role": "admin"          // 角色
}
```

## 使用示例

### 在视图中调用 API

```swift
import SwiftUI

struct ContentView: View {
    @State private var username = ""
    @State private var password = ""
    @State private var userType = "client"
    @State private var isLoggedIn = false
    @State private var errorMessage = ""
    @State private var showAlert = false

    func login() {
        AuthService.shared.signInWithUsername(
            username: username,
            password: password,
            role: userType
        ) { result in
            DispatchQueue.main.async {
                switch result {
                case .success():
                    isLoggedIn = true
                    print("✅ 登录成功")
                case .failure(let error):
                    errorMessage = error.localizedDescription
                    showAlert = true
                    print("❌ 登录失败: \(error)")
                }
            }
        }
    }
}
```

## 扩展 API 功能

### 添加新的数据获取方法

```swift
// 在 AuthService 类中添加新方法
func fetchVehicleData(completion: @escaping (Result<[Vehicle], Error>) -> Void) {
    db.collection("vehicles").getDocuments { snapshot, error in
        if let error = error {
            completion(.failure(error))
            return
        }
        
        guard let documents = snapshot?.documents else {
            completion(.success([]))
            return
        }
        
        // 解析车辆数据
        let vehicles = documents.compactMap { doc -> Vehicle? in
            let data = doc.data()
            return Vehicle(
                id: doc.documentID,
                name: data["name"] as? String ?? "",
                status: data["status"] as? String ?? ""
            )
        }
        
        completion(.success(vehicles))
    }
}
```

### 添加数据模型

```swift
// 创建数据模型
struct Vehicle: Identifiable, Codable {
    let id: String
    let name: String
    let status: String
}

struct User: Identifiable, Codable {
    let id: String
    let name: String
    let role: String
}
```

## 错误处理

### 常见错误类型

1. **网络错误** - Firebase 连接失败
2. **认证错误** - 用户名、密码或角色不匹配  
3. **权限错误** - Firebase 规则限制

### 错误处理最佳实践

```swift
AuthService.shared.signInWithUsername(...) { result in
    DispatchQueue.main.async {
        switch result {
        case .success():
            // 处理成功情况
            break
        case .failure(let error):
            // 根据错误类型处理
            if (error as NSError).code == 401 {
                // 认证失败
                print("用户名或密码错误")
            } else {
                // 其他错误
                print("系统错误: \(error.localizedDescription)")
            }
        }
    }
}
```

## 最佳实践

1. **单例模式** - 使用 `AuthService.shared` 确保全局唯一实例
2. **异步调用** - 所有 Firestore 操作都是异步的
3. **主线程更新** - UI 更新必须在主线程执行
4. **错误处理** - 总是处理可能的错误情况
5. **类型安全** - 使用强类型模型而不是字典

## 调试建议

1. **启用详细日志** - 代码中已包含详细的 print 语句
2. **检查 Firebase 控制台** - 确认数据结构正确
3. **验证网络连接** - 确保设备可以访问 Firebase
4. **查看 Xcode 控制台** - 观察详细的执行日志

## 测试用户数据

```json
{
  "name": "ABC",
  "password": 123,
  "role": "admin"
}
```

使用此数据可以在应用中进行登录测试。