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
    @State private var hasLoaded = false   // 避免 onAppear 重复请求

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 16) {

                    if isLoading {
                        ProgressView("Loading…")
                            .padding(.top)
                    }

                    if !tasks.isEmpty {
                        VStack(alignment: .leading, spacing: 10) {
                            Text("Task Data (\(tasks.count))")
                                .font(.headline)
                                .padding(.horizontal)

                            ForEach(tasks, id: \.id) { task in
                                TaskRowView(task: task)
                            }
                        }
                    } else if !isLoading {
                        Text("No task data available")
                            .foregroundColor(.secondary)
                            .padding(.top, 24)
                    }

                    Spacer(minLength: 24)
                }
            }
            .navigationTitle("Task Data")
            .alert("Error", isPresented: $showAlert) {
                Button("OK") { }
            } message: {
                Text(errorMessage)
            }
            .onAppear {
                if !hasLoaded {
                    hasLoaded = true
                    fetchAllTasks()           // 如果你想默认只看进行中，改为 fetchActiveTasks()
                }
            }
            .refreshable {                   // 下拉刷新
                fetchAllTasks()
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
                print("🎉 Successfully fetched \(fetched.count) tasks")
            case .failure(let error):
                errorMessage = "Failed to fetch tasks: \(error.localizedDescription)"
                showAlert = true
                print("❌ Failed to fetch tasks: \(error)")
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
                print("🎉 Successfully fetched \(fetched.count) active tasks")
            case .failure(let error):
                errorMessage = "Failed to fetch tasks: \(error.localizedDescription)"
                showAlert = true
                print("❌ Failed to fetch tasks: \(error)")
            }
        }
    }
}

#Preview {
    TasksDataView()
}
