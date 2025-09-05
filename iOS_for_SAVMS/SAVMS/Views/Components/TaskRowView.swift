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
        VStack(alignment: .leading, spacing: 6) {
            Text("📋 \(task.title)")
                .font(.subheadline)
                .fontWeight(.medium)

            Text(task.description)
                .font(.caption)
                .foregroundColor(.secondary)

            Text("状态: \(taskStatusText(task.status))")
                .font(.caption)
                .foregroundColor(taskStatusColor(task.status))

            Text("起点: \(task.startLocation.address)")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color.green.opacity(0.1))
        .cornerRadius(8)
        .padding(.horizontal)
    }

    // MARK: - 辅助
    private func taskStatusText(_ status: Int) -> String {
        switch status {
        case 0: return "未分配"
        case 1: return "进行中"
        case 2: return "已完成"
        case 3: return "已取消"
        default: return "未知(\(status))"
        }
    }

    private func taskStatusColor(_ status: Int) -> Color {
        switch status {
        case 0: return .orange
        case 1: return .blue
        case 2: return .green
        case 3: return .red
        default: return .gray
        }
    }
}
