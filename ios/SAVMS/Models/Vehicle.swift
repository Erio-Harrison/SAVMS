import Foundation

// MARK: - Vehicle Model
struct Vehicle: Codable {
    let id: String?
    
    // Basic Vehicle Info
    let licensePlate: String
    let carModel: String
    let year: Int
    let energyType: String
    
    // Vehicle Dimensions
    let length: Double
    let width: Double
    let height: Double
    
    // Radar
    let radarModel: String?
    let radarCount: Int
    
    // Camera
    let cameraModel: String?
    let cameraCount: Int
    
    // Communication
    let ipAddress: String?
    
    // Running Info
    let longitude: Double
    let latitude: Double
    let speed: Double
    let leftoverEnergy: Int // 0-100
    let connectionStatus: Int // 0/1
    let taskStatus: Int // 0/1
    let healthStatus: Int // 0/1
    
    // Engine Info
    let engineRPM: Int
    let lubeOilPressure: Double
    let fuelPressure: Double
    let coolantPressure: Double
    let lubeOilTemp: Double
    let coolantTemp: Double
    let intakeManifoldPressure: Double
    let intakeManifoldTemp: Double
    let fuelLevel: Double
    let throttlePosition: Double
    let vehicleSpeed: Double
    let airflowRate: Double
    let engineLoadValue: Double
    let batteryVoltage: Double
    let ambientAirTemp: Double
    
    enum CodingKeys: String, CodingKey {
        case id
        case licensePlate
        case carModel
        case year
        case energyType
        case length
        case width
        case height
        case radarModel
        case radarCount
        case cameraModel
        case cameraCount
        case ipAddress
        case longitude
        case latitude
        case speed
        case leftoverEnergy
        case connectionStatus
        case taskStatus
        case healthStatus
        case engineRPM
        case lubeOilPressure
        case fuelPressure
        case coolantPressure
        case lubeOilTemp
        case coolantTemp
        case intakeManifoldPressure
        case intakeManifoldTemp
        case fuelLevel
        case throttlePosition
        case vehicleSpeed
        case airflowRate
        case engineLoadValue
        case batteryVoltage
        case ambientAirTemp
    }
}

// MARK: - API Response Models
struct VehicleResponse: Codable {
    let success: Bool
    let data: Vehicle?
    let message: String?
}

struct VehicleListResponse: Codable {
    let success: Bool
    let data: [Vehicle]?
    let message: String?
}

// MARK: - Location Extension
extension Vehicle {
    var coordinate: (latitude: Double, longitude: Double) {
        return (latitude: latitude, longitude: longitude)
    }
    
    var isOnline: Bool {
        return connectionStatus == 1
    }
    
    var hasActiveTask: Bool {
        return taskStatus == 1
    }
    
    var isHealthy: Bool {
        return healthStatus == 1
    }
    
    var energyPercentage: String {
        return "\(leftoverEnergy)%"
    }
    
    var speedFormatted: String {
        return String(format: "%.1f km/h", speed)
    }
}