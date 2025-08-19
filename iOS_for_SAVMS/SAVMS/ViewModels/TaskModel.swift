//
//  TaskModel.swift
//  SAVMS
//
//  Created by Renken G on 19/8/2025.
//

struct Task: Identifiable, Codable {
    var id: String
    var title: String
    var description: String
    var startTime: Date
    var endTime: Date
    var status: TaskStatus
    var startLocation: Location
    var endLocation: Location
    var vehicle: Vehicle
    var startPoint: GeoPoint        // GeoJSON: coordinates [lng, lat]
    var endPoint: GeoPoint          // GeoJSON: coordinates [lng, lat]
    var vehicleLocation: Location

    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case title, description, startTime, endTime, status
        case startLocation, endLocation, vehicle, startPoint, endPoint, vehicleLocation
    }
}

// MARK: - Enums

enum TaskStatus: Int, Codable {
    case unknown = 0
    case active = 1
    case completed = 2
    case cancelled = 3
}

// MARK: - Nested types

struct Location: Codable {
    var address: String
    var lat: Double
    var lng: Double
}

