//
//  TaskRowView.swift
//  SAVMS
//
//  Created by Renken G on 5/9/2025.
//


import SwiftUI

struct TaskRowView: View {
    let task: BackendTask

    var body: some View {
        ZStack(alignment: .leading) {
            // Accent bar changes with status
            Capsule()
                .fill(LinearGradient(colors: [statusColor.opacity(0.95), statusColor.opacity(0.6)],
                                     startPoint: .top, endPoint: .bottom))
                .frame(width: 4)

            HStack(alignment: .top, spacing: 12) {
                // Icon bubble with status tint
                ZStack {
                    Circle()
                        .fill(statusColor.opacity(0.15))
                    Image(systemName: statusSymbol)
                        .font(.title3)
                        .foregroundStyle(statusColor)
                        .symbolRenderingMode(.hierarchical)
                }
                .frame(width: 44, height: 44)

                VStack(alignment: .leading, spacing: 10) {
                    // Title + status chip
                    HStack(alignment: .firstTextBaseline) {
                        Text(task.title)
                            .font(.headline)
                            .lineLimit(2)
                        Spacer()
                        StatusChip(text: statusText, color: statusColor)
                    }

                    // Description
                    if !task.description.isEmpty {
                        Text(task.description)
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                            .lineLimit(2)
                    }

                    // Address
                    Label("Start: \(task.startLocation.address)",
                          systemImage: "location.fill.viewfinder")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .lineLimit(1)
                        .truncationMode(.tail)
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
            .padding(.leading, 4)
        }
        .padding(.horizontal)
        .contentShape(Rectangle())
    }

    // MARK: - Status mapping
    private var statusText: String {
        switch task.status {
        case 0: return "Unassigned"
        case 1: return "In Progress"
        case 2: return "Completed"
        case 3: return "Cancelled"
        default: return "Unknown(\(task.status))"
        }
    }

    private var statusColor: Color {
        switch task.status {
        case 0: return .orange
        case 1: return .blue
        case 2: return .green
        case 3: return .red
        default: return .gray
        }
    }

    private var statusSymbol: String {
        switch task.status {
        case 0: return "tray.and.arrow.down.fill"
        case 1: return "clock.badge.checkmark"
        case 2: return "checkmark.seal.fill"
        case 3: return "xmark.octagon.fill"
        default: return "questionmark.circle.fill"
        }
    }
}

// MARK: - Reusable chip

private struct StatusChip: View {
    let text: String
    let color: Color
    var body: some View {
        HStack(spacing: 6) {
            Circle().fill(color).frame(width: 6, height: 6)
            Text(text).bold()
        }
        .font(.caption)
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(
            Capsule().fill(color.opacity(0.12))
        )
        .overlay(
            Capsule().stroke(color.opacity(0.25))
        )
        .foregroundStyle(color)
        .frame(minWidth: 90, alignment: .trailing)
    }
}
