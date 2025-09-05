//
//  VehicleRowView.swift
//  SAVMS
//
//  Created by Renken G on 5/9/2025.
//

import SwiftUI

struct VehicleRowView: View {
    let vehicle: BackendVehicle

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("🚗 \(vehicle.licensePlate) - \(vehicle.carModel)")
                .font(.subheadline)
                .fontWeight(.medium)

            Text("位置: (\(vehicle.latitude), \(vehicle.longitude))")
                .font(.caption)
                .foregroundColor(.secondary)

            Text("速度: \(vehicle.speed, specifier: "%.1f") km/h | 电量: \(vehicle.leftoverEnergy)%")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color.blue.opacity(0.1))
        .cornerRadius(8)
        .padding(.horizontal)
    }
}
