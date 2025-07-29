import Foundation

// MARK: - Vehicle Service
class VehicleService {
    private let networkService = NetworkService.shared
    
    // MARK: - Get All Vehicles
    func getAllVehicles(completion: @escaping (Result<[Vehicle], NetworkError>) -> Void) {
        networkService.performRequest(
            endpoint: "/vehicles/all",
            responseType: APIResult<[Vehicle]>.self
        ) { result in
            switch result {
            case .success(let apiResult):
                if apiResult.success, let vehicles = apiResult.data {
                    completion(.success(vehicles))
                } else {
                    completion(.failure(.requestFailed(NSError(domain: "VehicleService", code: -1, userInfo: [NSLocalizedDescriptionKey: apiResult.message ?? "Unknown error"]))))
                }
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    // MARK: - Get Vehicle by ID
    func getVehicle(byId id: String, completion: @escaping (Result<Vehicle, NetworkError>) -> Void) {
        networkService.performRequest(
            endpoint: "/vehicles/get/\(id)",
            responseType: APIResult<Vehicle>.self
        ) { result in
            switch result {
            case .success(let apiResult):
                if apiResult.success, let vehicle = apiResult.data {
                    completion(.success(vehicle))
                } else {
                    completion(.failure(.requestFailed(NSError(domain: "VehicleService", code: -1, userInfo: [NSLocalizedDescriptionKey: apiResult.message ?? "Vehicle not found"]))))
                }
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    // MARK: - Create Vehicle
    func createVehicle(_ vehicle: Vehicle, completion: @escaping (Result<Vehicle, NetworkError>) -> Void) {
        guard let vehicleData = try? JSONEncoder().encode(vehicle) else {
            completion(.failure(.requestFailed(NSError(domain: "VehicleService", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to encode vehicle data"]))))
            return
        }
        
        networkService.performRequest(
            endpoint: "/vehicles/create",
            method: .POST,
            body: vehicleData,
            responseType: APIResult<Vehicle>.self
        ) { result in
            switch result {
            case .success(let apiResult):
                if apiResult.success, let createdVehicle = apiResult.data {
                    completion(.success(createdVehicle))
                } else {
                    completion(.failure(.requestFailed(NSError(domain: "VehicleService", code: -1, userInfo: [NSLocalizedDescriptionKey: apiResult.message ?? "Failed to create vehicle"]))))
                }
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    // MARK: - Update Vehicle
    func updateVehicle(_ vehicle: Vehicle, completion: @escaping (Result<Vehicle, NetworkError>) -> Void) {
        guard let vehicleData = try? JSONEncoder().encode(vehicle) else {
            completion(.failure(.requestFailed(NSError(domain: "VehicleService", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to encode vehicle data"]))))
            return
        }
        
        networkService.performRequest(
            endpoint: "/vehicles/update",
            method: .PUT,
            body: vehicleData,
            responseType: APIResult<Vehicle>.self
        ) { result in
            switch result {
            case .success(let apiResult):
                if apiResult.success, let updatedVehicle = apiResult.data {
                    completion(.success(updatedVehicle))
                } else {
                    completion(.failure(.requestFailed(NSError(domain: "VehicleService", code: -1, userInfo: [NSLocalizedDescriptionKey: apiResult.message ?? "Failed to update vehicle"]))))
                }
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    // MARK: - Delete Vehicle
    func deleteVehicle(byId id: String, completion: @escaping (Result<Bool, NetworkError>) -> Void) {
        networkService.performRequest(
            endpoint: "/vehicles/delete/\(id)",
            method: .DELETE,
            responseType: APIResult<String>.self
        ) { result in
            switch result {
            case .success(let apiResult):
                completion(.success(apiResult.success))
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    // MARK: - Get Vehicles by Status
    func getVehicles(byStatus status: VehicleStatus, completion: @escaping (Result<[Vehicle], NetworkError>) -> Void) {
        let endpoint: String
        switch status {
        case .online:
            endpoint = "/vehicles/online"
        case .offline:
            endpoint = "/vehicles/offline"
        case .withTasks:
            endpoint = "/vehicles/with-tasks"
        case .healthy:
            endpoint = "/vehicles/healthy"
        }
        
        networkService.performRequest(
            endpoint: endpoint,
            responseType: APIResult<[Vehicle]>.self
        ) { result in
            switch result {
            case .success(let apiResult):
                if apiResult.success, let vehicles = apiResult.data {
                    completion(.success(vehicles))
                } else {
                    completion(.failure(.requestFailed(NSError(domain: "VehicleService", code: -1, userInfo: [NSLocalizedDescriptionKey: apiResult.message ?? "No vehicles found"]))))
                }
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
}

// MARK: - Vehicle Status Enum
enum VehicleStatus {
    case online
    case offline
    case withTasks
    case healthy
}