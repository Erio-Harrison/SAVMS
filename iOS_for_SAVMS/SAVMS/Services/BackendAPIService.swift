//
//  BackendAPIService.swift
//  SAVMS
//
//  Created by Yang Hu on 31/8/2025.
//

import Foundation

class BackendAPIService {
    static let shared = BackendAPIService()
    
    // 服务器配置
    private let baseURL = "http://localhost:8080"
    
    private init() {}
    
    // MARK: - 登录API
    func signInWithUsername(
        username: String,
        password: String,
        role: String,
        completion: @escaping (Result<LoginResponse, APIError>) -> Void
    ) {
        // 1. 创建登录请求
        let loginRequest = LoginRequest(
            username: username,
            password: password,
            roleString: role
        )
        
        // 2. 创建URL
        guard let url = URL(string: "\(baseURL)/api/auth/login") else {
            completion(.failure(.invalidURL))
            return
        }
        
        // 3. 创建URLRequest
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        // 4. 编码请求数据
        do {
            let requestData = try JSONEncoder().encode(loginRequest)
            request.httpBody = requestData
        } catch {
            completion(.failure(.networkError("Failed to encode request data")))
            return
        }
        
        // 5. 发送网络请求
        URLSession.shared.dataTask(with: request) { data, response, error in
            // 确保回调在主线程执行
            DispatchQueue.main.async {
                // 处理网络错误
                if let error = error {
                    completion(.failure(.networkError(error.localizedDescription)))
                    return
                }
                
                // 检查响应数据
                guard let data = data else {
                    completion(.failure(.noData))
                    return
                }
                
                // 解析响应数据
                do {
                    let apiResponse = try JSONDecoder().decode(APIResponse<LoginResponse>.self, from: data)
                    
                    if apiResponse.isSuccess, let loginData = apiResponse.data {
                        // 登录成功
                        completion(.success(loginData))
                    } else {
                        // 服务器返回错误
                        let errorMessage = apiResponse.msg ?? "Unknown error"
                        completion(.failure(.serverError(errorMessage)))
                    }
                } catch {
                    completion(.failure(.decodingError(error.localizedDescription)))
                }
            }
        }.resume()
    }
    
    // MARK: - 车辆API
    func getAllVehicles(completion: @escaping (Result<[BackendVehicle], APIError>) -> Void) {
        print("🚗 BackendAPIService: 获取所有车辆")
        
        guard let url = URL(string: "\(baseURL)/vehicles/get/all") else {
            completion(.failure(.invalidURL))
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                if let error = error {
                    completion(.failure(.networkError(error.localizedDescription)))
                    return
                }
                
                guard let data = data else {
                    completion(.failure(.noData))
                    return
                }
                
                // 🔍 调试：打印原始响应数据
                if let jsonString = String(data: data, encoding: .utf8) {
                    print("📦 车辆API原始响应: \(jsonString)")
                }
                
                do {
                    let apiResponse = try JSONDecoder().decode(APIResponse<[BackendVehicle]>.self, from: data)
                    
                    if apiResponse.isSuccess, let vehicles = apiResponse.data {
                        print("✅ 获取到 \(vehicles.count) 辆车辆")
                        completion(.success(vehicles))
                    } else {
                        let errorMessage = apiResponse.msg ?? "获取车辆失败"
                        completion(.failure(.serverError(errorMessage)))
                    }
                } catch {
                    completion(.failure(.decodingError(error.localizedDescription)))
                }
            }
        }.resume()
    }
    
    func getVehicle(byId id: String, completion: @escaping (Result<BackendVehicle, APIError>) -> Void) {
        print("🚗 BackendAPIService: 获取车辆ID \(id)")
        
        guard let url = URL(string: "\(baseURL)/vehicles/get/id/\(id)") else {
            completion(.failure(.invalidURL))
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                if let error = error {
                    completion(.failure(.networkError(error.localizedDescription)))
                    return
                }
                
                guard let data = data else {
                    completion(.failure(.noData))
                    return
                }
                
                do {
                    let vehicle = try JSONDecoder().decode(BackendVehicle.self, from: data)
                    print("✅ 获取到车辆: \(vehicle.licensePlate)")
                    completion(.success(vehicle))
                } catch {
                    completion(.failure(.decodingError(error.localizedDescription)))
                }
            }
        }.resume()
    }
    
    // MARK: - 任务API
    func getAllTasks(completion: @escaping (Result<[BackendTask], APIError>) -> Void) {
        print("📋 BackendAPIService: 获取所有任务")
        
        guard let url = URL(string: "\(baseURL)/api/tasks/all") else {
            completion(.failure(.invalidURL))
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                if let error = error {
                    completion(.failure(.networkError(error.localizedDescription)))
                    return
                }
                
                guard let data = data else {
                    completion(.failure(.noData))
                    return
                }
                
                // 🔍 调试：打印任务API原始响应数据
                if let jsonString = String(data: data, encoding: .utf8) {
                    print("📦 任务API原始响应: \(jsonString)")
                }
                
                do {
                    let apiResponse = try JSONDecoder().decode(APIResponse<[BackendTask]>.self, from: data)
                    
                    if apiResponse.isSuccess, let tasks = apiResponse.data {
                        print("✅ 获取到 \(tasks.count) 个任务")
                        completion(.success(tasks))
                    } else {
                        let errorMessage = apiResponse.msg ?? "获取任务失败"
                        completion(.failure(.serverError(errorMessage)))
                    }
                } catch {
                    completion(.failure(.decodingError(error.localizedDescription)))
                }
            }
        }.resume()
    }
    
    func getTasks(byStatus status: Int, completion: @escaping (Result<[BackendTask], APIError>) -> Void) {
        print("📋 BackendAPIService: 获取状态为 \(status) 的任务")
        
        guard let url = URL(string: "\(baseURL)/api/tasks/status/\(status)") else {
            completion(.failure(.invalidURL))
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                if let error = error {
                    completion(.failure(.networkError(error.localizedDescription)))
                    return
                }
                
                guard let data = data else {
                    completion(.failure(.noData))
                    return
                }
                
                // 🔍 调试：打印任务状态API原始响应数据
                if let jsonString = String(data: data, encoding: .utf8) {
                    print("📦 任务状态API原始响应: \(jsonString)")
                }
                
                do {
                    let apiResponse = try JSONDecoder().decode(APIResponse<[BackendTask]>.self, from: data)
                    
                    if apiResponse.isSuccess, let tasks = apiResponse.data {
                        print("✅ 获取到 \(tasks.count) 个状态为 \(status) 的任务")
                        completion(.success(tasks))
                    } else {
                        let errorMessage = apiResponse.msg ?? "获取任务失败"
                        completion(.failure(.serverError(errorMessage)))
                    }
                } catch {
                    completion(.failure(.decodingError(error.localizedDescription)))
                }
            }
        }.resume()
    }
}

// 通用API响应格式 - 移到类外面
struct APIResponse<T: Codable>: Codable {
    let code: Int // 1=success 0=fail
    let msg: String? // error message
    let data: T?
    
    var isSuccess: Bool {
        return code == 1
    }
}

// MARK: - 数据模型

// 登录请求模型
struct LoginRequest: Codable {
    let username: String
    let password: String
    let role: Int  // 0=admin, 1=client
    
    // 便利初始化方法 - 从字符串角色转换为数字
    init(username: String, password: String, roleString: String) {
        self.username = username
        self.password = password
        // "admin" -> 0, "client" -> 1
        self.role = (roleString.lowercased() == "admin") ? 0 : 1
    }
    
    // 直接使用数字角色的初始化方法
    init(username: String, password: String, role: Int) {
        self.username = username
        self.password = password
        self.role = role
    }
}

// 登录响应模型
struct LoginResponse: Codable {
    let token: String
    let id: String
    let username: String
    let email: String
    let role: Int
}

// 用户模型
struct BackendUser: Codable {
    let id: String
    let username: String
    let email: String
    let role: Int
}

// 车辆模型 (对应后端Vehicle实体)
struct BackendVehicle: Codable {
    let id: String
    let licensePlate: String
    let carModel: String
    let year: Int
    let energyType: String
    let length: Double
    let width: Double
    let height: Double
    let radarModel: String
    let radarCount: Int
    let cameraModel: String
    let cameraCount: Int
    let ipAddress: String?      // 可能为null
    let longitude: Double
    let latitude: Double
    let location: VehicleLocation?  // GeoJSON位置信息，可能为null
    let speed: Double
    let leftoverEnergy: Int     // 注意：后端返回的是Int，不是Double
    let connectionStatus: Int
    let taskStatus: Int
    let healthStatus: Int
    let engineRPM: Int          // 注意：后端返回的是Int，不是Double
    let lubeOilPressure: Double
    let fuelPressure: Double
    let coolantPressure: Double
    let lubeOilTemp: Double
    let coolantTemp: Double
    let engineCondition: Int
    let images: [String]?       // 可能为null
}

// 车辆位置GeoJSON模型
struct VehicleLocation: Codable {
    let x: Double
    let y: Double
    let type: String
    let coordinates: [Double]
}

// 任务模型 (对应后端TaskNode实体)
struct BackendTask: Codable {
    let id: String
    let title: String
    let description: String
    let startTime: String
    let endTime: String
    let status: Int
    let startLocation: TaskLocation
    let endLocation: TaskLocation
    let vehicleLocation: TaskLocation?
    let startPoint: TaskGeoPoint  // 使用新名称避免冲突
    let endPoint: TaskGeoPoint
    let assignedVehicleId: String?
    let vehicle: TaskVehicle
}

// 任务中的车辆信息
struct TaskVehicle: Codable {
    let vehicleNumber: String?
    let plateNumber: String
}

// 任务GeoJSON点位信息 (避免与VehicleModel中的GeoPoint冲突)
struct TaskGeoPoint: Codable {
    let x: Double
    let y: Double
    let type: String
    let coordinates: [Double]
}

// 任务位置模型
struct TaskLocation: Codable {
    let address: String
    let lat: Double
    let lng: Double
}

// API错误类型
enum APIError: Error, Equatable {
    case invalidURL
    case noData
    case networkError(String)
    case decodingError(String)
    case serverError(String)  // 当code=0时的服务器错误
    
    var localizedDescription: String {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .noData:
            return "No data received"
        case .networkError(let message):
            return "Network error: \(message)"
        case .decodingError(let message):
            return "Data parsing error: \(message)"
        case .serverError(let message):
            return "Server error: \(message)"
        }
    }
}
