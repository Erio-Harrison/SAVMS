//
//  MenuButtonView.swift
//  SAVMS
//
//  Created by Renken G on 19/8/2025.
//

import SwiftUI

private enum MenuSheet: String, Identifiable {
    case dataTest, speechTest, vehicles, tasks, profile
    var id: String { rawValue }
}

struct MenuButtonView: View {
    @State private var activeSheet: MenuSheet?

    var body: some View {
        Menu {
            //Button("API Data Testing") { activeSheet = .dataTest }
            Button("Speech-to-text test") { activeSheet = .speechTest }
            Button("Home") { /* action */ }
            Button("Vehicles") { activeSheet = .vehicles }  // 打开车辆数据显示
            Button("Tasks") { activeSheet = .tasks }        // 打开任务数据显示
            Button("Profile") { activeSheet = .profile }
            //Button("Settings") { /* action */ }
        } label: {
            Image(systemName: "line.horizontal.3")
                .font(.title2)
                .frame(width: 44, height: 44)
                .background(
                    Circle()
                        .fill(.ultraThickMaterial)
                        .shadow(radius: 4, y: 2)
                )
        }
        .buttonStyle(.plain)
        .contentShape(Circle())
        .padding(.leading, 16)
        .padding(.top, 16)
        .zIndex(2)
        .sheet(item: $activeSheet) { sheet in
            switch sheet {
            case .dataTest:
                DataTestView()                  // 你现有的测试页面（可保留）
            case .speechTest:
                SpeechToTextTestView()
            case .vehicles:
                VehiclesDataView()              // 新建的车辆数据页面
            case .tasks:
                TasksDataView()                 // 新建的任务数据页面
            case .profile:
                ProfileView()
            }
        }
    }
}
