//
//  VehiclesDataView.swift
//  SAVMS
//
//  Created by Renken G on 5/9/2025.
//

import SwiftUI

struct VehiclesDataView: View {
    @State private var vehicles: [BackendVehicle] = []
    @State private var errorMessage = ""
    @State private var showAlert = false
    @State private var isLoading = false

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 16) {

                    // 测试按钮区域
                    VStack(spacing: 12) {
                        Button("获取所有车辆") { fetchAllVehicles() }
                            .buttonStyle(.borderedProminent)

                        if isLoading {
                            ProgressView("加载中…")
                        }
                    }
                    .padding(.top)

                    // 车辆数据显示
                    if !vehicles.isEmpty {
                        VStack(alignment: .leading, spacing: 10) {
                            Text("车辆数据 (\(vehicles.count)辆)")
                                .font(.headline)
                                .padding(.horizontal)

                            ForEach(vehicles, id: \.id) { vehicle in
                                VehicleRowView(vehicle: vehicle)
                            }
                        }
                    } else if !isLoading {
                        Text("暂无车辆数据")
                            .foregroundColor(.secondary)
                            .padding(.top, 24)
                    }

                    Spacer(minLength: 24)
                }
            }
            .navigationTitle("车辆数据")
            .alert("错误", isPresented: $showAlert) {
                Button("确定") { }
            } message: {
                Text(errorMessage)
            }
        }
    }

    // MARK: - API
    private func fetchAllVehicles() {
        isLoading = true
        vehicles.removeAll()
        BackendAPIService.shared.getAllVehicles { result in
            isLoading = false
            switch result {
            case .success(let fetched):
                vehicles = fetched
                print("🎉 成功获取 \(fetched.count) 辆车辆")
            case .failure(let error):
                errorMessage = "获取车辆失败: \(error.localizedDescription)"
                showAlert = true
                print("❌ 获取车辆失败: \(error)")
            }
        }
    }
}

#Preview {
    VehiclesDataView()
}
