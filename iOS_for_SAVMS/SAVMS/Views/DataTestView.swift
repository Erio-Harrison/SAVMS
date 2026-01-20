//
//  DataTestView.swift
//  SAVMS
//
//  Created by Yang Hu on 31/8/2025.
//

import SwiftUI

struct DataTestView: View {
    @State private var vehicles: [BackendVehicle] = []
    @State private var tasks: [BackendTask] = []
    @State private var errorMessage = ""
    @State private var showAlert = false
    @State private var isLoading = false
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    // 测试按钮区域
                    VStack(spacing: 15) {
                        Button("获取所有车辆") {
                            fetchAllVehicles()
                        }
                        .buttonStyle(.borderedProminent)
                        
                        Button("获取所有任务") {
                            fetchAllTasks()
                        }
                        .buttonStyle(.borderedProminent)
                        
                        Button("获取进行中的任务 (状态=1)") {
                            fetchActiveTasks()
                        }
                        .buttonStyle(.bordered)
                        
                        if isLoading {
                            ProgressView("加载中...")
                                .progressViewStyle(CircularProgressViewStyle())
                        }
                    }
                    .padding()
                    
                    // 车辆数据显示
                    if !vehicles.isEmpty {
                        VStack(alignment: .leading, spacing: 10) {
                            Text("车辆数据 (\(vehicles.count)辆)")
                                .font(.headline)
                                .padding(.horizontal)
                            
                            ForEach(vehicles, id: \.id) { vehicle in
                                VStack(alignment: .leading, spacing: 5) {
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
                    }
                    
                    // 任务数据显示
                    if !tasks.isEmpty {
                        VStack(alignment: .leading, spacing: 10) {
                            Text("任务数据 (\(tasks.count)个)")
                                .font(.headline)
                                .padding(.horizontal)
                            
                            ForEach(tasks, id: \.id) { task in
                                VStack(alignment: .leading, spacing: 5) {
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
                        }
                    }
                    
                    Spacer()
                }
            }
            .navigationTitle("API数据测试")
            .alert("错误", isPresented: $showAlert) {
                Button("确定") { }
            } message: {
                Text(errorMessage)
            }
        }
    }
    
    // MARK: - API调用方法
    private func fetchAllVehicles() {
        isLoading = true
        vehicles.removeAll()
        
        BackendAPIService.shared.getAllVehicles { result in
            isLoading = false
            
            switch result {
            case .success(let fetchedVehicles):
                vehicles = fetchedVehicles
                print("🎉 成功获取 \(fetchedVehicles.count) 辆车辆")
            case .failure(let error):
                errorMessage = "获取车辆失败: \(error.localizedDescription)"
                showAlert = true
                print("❌ 获取车辆失败: \(error)")
            }
        }
    }
    
    private func fetchAllTasks() {
        isLoading = true
        tasks.removeAll()
        
        BackendAPIService.shared.getAllTasks { result in
            isLoading = false
            
            switch result {
            case .success(let fetchedTasks):
                tasks = fetchedTasks
                print("🎉 成功获取 \(fetchedTasks.count) 个任务")
            case .failure(let error):
                errorMessage = "获取任务失败: \(error.localizedDescription)"
                showAlert = true
                print("❌ 获取任务失败: \(error)")
            }
        }
    }
    
    private func fetchActiveTasks() {
        isLoading = true
        tasks.removeAll()
        
        BackendAPIService.shared.getTasks(byStatus: 1) { result in
            isLoading = false
            
            switch result {
            case .success(let fetchedTasks):
                tasks = fetchedTasks
                print("🎉 成功获取 \(fetchedTasks.count) 个进行中的任务")
            case .failure(let error):
                errorMessage = "获取任务失败: \(error.localizedDescription)"
                showAlert = true
                print("❌ 获取任务失败: \(error)")
            }
        }
    }
    
    // MARK: - 辅助方法
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

#Preview {
    DataTestView()
}
