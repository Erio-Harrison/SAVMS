//
//  SpeechToTextTestView.swift
//  SAVMS
//
//  Created by Yang Hu on 24/8/2025.
//

import SwiftUI

struct SpeechToTextTestView: View {
    @StateObject private var speechService = SpeechRecognitionService.shared
    @State private var showingPermissionAlert = false
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                // 标题
                Text("语音转文字测试")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .padding(.top)
                
                Spacer()
                
                // 录音状态指示器
                Circle()
                    .fill(speechService.isRecording ? Color.red : Color.gray)
                    .frame(width: 100, height: 100)
                    .overlay(
                        Image(systemName: speechService.isRecording ? "mic.fill" : "mic.slash.fill")
                            .font(.largeTitle)
                            .foregroundColor(.white)
                    )
                    .scaleEffect(speechService.isRecording ? 1.1 : 1.0)
                    .animation(.easeInOut(duration: 0.6).repeatForever(autoreverses: true), value: speechService.isRecording)
                
                // 识别状态文本
                Text(speechService.isRecording ? "正在录音..." : "点击开始录音")
                    .font(.headline)
                    .foregroundColor(speechService.isRecording ? .red : .gray)
                
                Spacer()
                
                // 识别结果显示区域
                ScrollView {
                    Text(speechService.recognizedText.isEmpty ? "识别结果将在此处显示..." : speechService.recognizedText)
                        .font(.body)
                        .padding()
                        .frame(maxWidth: .infinity, minHeight: 120, alignment: .topLeading)
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(10)
                        .foregroundColor(speechService.recognizedText.isEmpty ? .gray : .primary)
                }
                .frame(height: 150)
                
                // 错误信息显示
                if !speechService.errorMessage.isEmpty {
                    Text(speechService.errorMessage)
                        .font(.caption)
                        .foregroundColor(.red)
                        .padding(.horizontal)
                }
                
                Spacer()
                
                // 控制按钮区域
                HStack(spacing: 20) {
                    // 开始/停止录音按钮
                    Button(action: toggleRecording) {
                        HStack {
                            Image(systemName: speechService.isRecording ? "stop.circle.fill" : "mic.circle.fill")
                                .font(.title2)
                            Text(speechService.isRecording ? "停止录音" : "开始录音")
                                .fontWeight(.semibold)
                        }
                        .foregroundColor(.white)
                        .padding()
                        .frame(minWidth: 140)
                        .background(speechService.isRecording ? Color.red : Color.blue)
                        .cornerRadius(25)
                    }
                    .disabled(speechService.isRecording ? false : speechService.errorMessage.contains("权限"))
                    
                    // 清除文本按钮
                    Button(action: {
                        speechService.clearText()
                    }) {
                        HStack {
                            Image(systemName: "trash.circle.fill")
                                .font(.title2)
                            Text("清除")
                                .fontWeight(.semibold)
                        }
                        .foregroundColor(.white)
                        .padding()
                        .frame(minWidth: 100)
                        .background(Color.orange)
                        .cornerRadius(25)
                    }
                }
                
                Spacer()
            }
            .padding()
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("关闭") {
                        dismiss()
                    }
                }
            }
        }
        .onAppear {
            _Concurrency.Task {
                let hasPermission = await speechService.requestPermissions()
                if !hasPermission {
                    await MainActor.run {
                        showingPermissionAlert = true
                    }
                }
            }
        }
        .alert("权限需要", isPresented: $showingPermissionAlert) {
            Button("确定") { }
        } message: {
            Text("请在设置中允许语音识别和麦克风权限")
        }
    }
    
    private func toggleRecording() {
        if speechService.isRecording {
            speechService.stopRecording()
        } else {
            _Concurrency.Task {
                let hasPermission = await speechService.requestPermissions()
                if hasPermission {
                    await MainActor.run {
                        speechService.startRecording()
                    }
                } else {
                    await MainActor.run {
                        showingPermissionAlert = true
                    }
                }
            }
        }
    }
}

#Preview {
    SpeechToTextTestView()
}