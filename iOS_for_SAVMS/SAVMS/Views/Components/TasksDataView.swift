//
//  TasksDataView.swift
//  SAVMS
//
//  Created by Renken G on 5/9/2025.
//


import SwiftUI

struct TasksDataView: View {
    @State private var tasks: [BackendTask] = []
    @State private var errorMessage = ""
    @State private var showAlert = false
    @State private var isLoading = false

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 16) {

                    // 测试按钮区域
                    VStack(spacing: 12) {
                        Button("获取所有任务") { fetchAllTasks() }
                            .buttonStyle(.borderedProminent)

                        Button("获取进行中的任务 (状态=1)") { fetchActiveTasks() }
                            .buttonStyle(.bordered)

                        if isLoading {
                            ProgressView("加载中…")
                        }
                    }
                    .padding(.top)

                    // 任务数据显示
                    if !tasks.isEmpty {
                        VStack(alignment: .leading, spacing: 10) {
                            Text("任务数据 (\(tasks.count)个)")
                                .font(.headline)
                                .padding(.horizontal)

                            ForEach(tasks, id: \.id) { task in
                                TaskRowView(task: task)
                            }
                        }
                    } else if !isLoading {
                        Text("暂无任务数据")
                            .foregroundColor(.secondary)
                            .padding(.top, 24)
                    }

                    Spacer(minLength: 24)
                }
            }
            .navigationTitle("任务数据")
            .alert("错误", isPresented: $showAlert) {
                Button("确定") { }
            } message: {
                Text(errorMessage)
            }
        }
    }

    // MARK: - API
    private func fetchAllTasks() {
        isLoading = true
        tasks.removeAll()
        BackendAPIService.shared.getAllTasks { result in
            isLoading = false
            switch result {
            case .success(let fetched):
                tasks = fetched
                print("🎉 成功获取 \(fetched.count) 个任务")
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
            case .success(let fetched):
                tasks = fetched
                print("🎉 成功获取 \(fetched.count) 个进行中的任务")
            case .failure(let error):
                errorMessage = "获取任务失败: \(error.localizedDescription)"
                showAlert = true
                print("❌ 获取任务失败: \(error)")
            }
        }
    }
}

#Preview {
    TasksDataView()
}
