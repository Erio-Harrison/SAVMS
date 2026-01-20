//
//  AlertModel.swift
//  SAVMS
//
//  Created by Renken G on 19/8/2025.
//

import Foundation

struct Alert: Identifiable, Codable {
    var id: String              // from "_id.$oid"
    var vehicleId: String       // from "vehicleId.$oid"
    var licensePlate: String
    var alertType: String
    var description: String
    var severity: String
    var status: String
    var timestamp: Date
    var resolvedAt: Date?       // null -> nil
}
