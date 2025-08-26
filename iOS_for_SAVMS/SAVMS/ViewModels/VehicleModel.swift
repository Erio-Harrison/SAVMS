//
//  VehicleModel.swift
//  SAVMS
//
//  Created by Renken G on 19/8/2025.
//

import Foundation

struct Vehicle: Identifiable, Codable {
    var id: String              // from "_id.$oid"
    var licensePlate: String
    var carModel: String
    var year: Int
    var energyType: String

    var length: Double
    var width: Double
    var height: Double

    var radarModel: String
    var radarCount: Int
    var cameraModel: String
    var cameraCount: Int

    var longitude: Double
    var latitude: Double

    var location: GeoPoint      // nested object

    var speed: Double
    var leftoverEnergy: Double
    var connectionStatus: Int
    var taskStatus: Int
    var healthStatus: Int

    var engineRPM: Double
    var lubeOilPressure: Double
    var fuelPressure: Double
    var coolantPressure: Double
    var lubeOilTemp: Double
    var coolantTemp: Double
    var engineCondition: Int

    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case licensePlate, carModel, year, energyType
        case length, width, height
        case radarModel, radarCount, cameraModel, cameraCount
        case longitude, latitude, location
        case speed, leftoverEnergy, connectionStatus, taskStatus, healthStatus
        case engineRPM, lubeOilPressure, fuelPressure, coolantPressure
        case lubeOilTemp, coolantTemp, engineCondition
    }
}

// MARK: - GeoJSON-style point

struct GeoPoint: Codable {
    var type: String
    var coordinates: [Double]   // [lng, lat]

    var longitude: Double { coordinates.first ?? 0 }
    var latitude: Double  { coordinates.dropFirst().first ?? 0 }
}
