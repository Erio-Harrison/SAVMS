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
        ZStack(alignment: .leading) {
            // Accent bar
            Capsule()
                .fill(LinearGradient(colors: [.blue, .purple], startPoint: .top, endPoint: .bottom))
                .frame(width: 4)

            HStack(alignment: .top, spacing: 12) {
                // Icon bubble
                ZStack {
                    Circle()
                        .fill(LinearGradient(colors: [.blue.opacity(0.25), .purple.opacity(0.25)],
                                             startPoint: .topLeading, endPoint: .bottomTrailing))
                    Image(systemName: "car.fill")
                        .font(.title3)
                        .foregroundStyle(.blue)
                        .symbolRenderingMode(.hierarchical)
                }
                .frame(width: 44, height: 44)

                VStack(alignment: .leading, spacing: 10) {
                    // Title row
                    HStack(alignment: .firstTextBaseline) {
                        Text(vehicle.carModel)
                            .font(.headline)
                            .lineLimit(1)
                        Spacer()
                        Chip(text: vehicle.licensePlate)
                    }

                    // Metrics row
                    HStack(spacing: 12) {
                        Label("\(Int(vehicle.speed)) km/h", systemImage: "speedometer")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)

                        Divider().frame(height: 16)

                        BatteryBar(percentage: vehicle.leftoverEnergy)
                            .frame(height: 8)
                            .accessibilityLabel(Text("Battery \(vehicle.leftoverEnergy)%"))
                    }

                    // Location
                    Label("\(coord(vehicle.latitude)), \(coord(vehicle.longitude))",
                          systemImage: "mappin.and.ellipse")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
            .padding(14)
            .background(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .fill(Color(.secondarySystemBackground))
            )
            .overlay(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .strokeBorder(Color.black.opacity(0.06))
            )
            .shadow(color: .black.opacity(0.06), radius: 8, x: 0, y: 4)
            .padding(.leading, 4) // room for accent bar
        }
        .padding(.horizontal)
        .contentShape(Rectangle())
    }

    // MARK: - Helpers
    private func coord(_ v: Double) -> String {
        String(format: "%.5f", v)
    }
}

// MARK: - Reusable bits

private struct Chip: View {
    let text: String
    var body: some View {
        Text(text)
            .font(.caption).bold()
            .monospaced()
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(
                Capsule().fill(Color.blue.opacity(0.12))
            )
            .overlay(
                Capsule().stroke(Color.blue.opacity(0.25))
            )
            .foregroundStyle(.blue)
    }
}

private struct BatteryBar: View {
    let percentage: Int
    var clamped: Double { max(0, min(100, Double(percentage))) / 100.0 }

    private var fillColor: Color {
        switch percentage {
        case ..<20: return .red
        case 20..<50: return .orange
        default: return .green
        }
    }

    // Normal (non-bolt) symbols by level
    private var batterySymbol: String {
        switch percentage {
        case ..<10:  return "battery.0"
        case ..<35:  return "battery.25"
        case ..<60:  return "battery.50"
        case ..<85:  return "battery.75"
        default:     return "battery.100"
        }
    }

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                Capsule().fill(Color.gray.opacity(0.15))
                Capsule()
                    .fill(
                        LinearGradient(
                            colors: [fillColor.opacity(0.9), fillColor.opacity(0.6)],
                            startPoint: .leading, endPoint: .trailing
                        )
                    )
                    .frame(width: geo.size.width * clamped)
            }
        }
        .frame(minHeight: 6)
        .overlay(
            HStack(spacing: 6) {
                Image(systemName: batterySymbol)
                    .symbolRenderingMode(.monochrome)  // ← ensure single-color rendering
                Text("\(percentage)%")
            }
            .font(.caption2)
            .foregroundStyle(.secondary)            // ← constant color for icon & text
            .padding(.leading, 6),
            alignment: .leading
        )
        .accessibilityLabel(Text("Battery \(percentage)%"))
    }
}
