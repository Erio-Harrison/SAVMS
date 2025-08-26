//
//  SpeechRecognitionService.swift
//  SAVMS
//
//  Created by Yang Hu on 24/8/2025.
//

import Foundation
import Speech
import AVFoundation

class SpeechRecognitionService: ObservableObject {
    static let shared = SpeechRecognitionService()
    
    private let speechRecognizer = SFSpeechRecognizer(locale: Locale(identifier: "zh-CN"))
    private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recognitionTask: SFSpeechRecognitionTask?
    private let audioEngine = AVAudioEngine()
    
    @Published var isRecording = false
    @Published var recognizedText = ""
    @Published var errorMessage = ""
    
    private init() {}
    
    func requestPermissions() async -> Bool {
        await withCheckedContinuation { continuation in
            SFSpeechRecognizer.requestAuthorization { authStatus in
                DispatchQueue.main.async {
                    switch authStatus {
                    case .authorized:
                        AVAudioSession.sharedInstance().requestRecordPermission { allowed in
                            DispatchQueue.main.async {
                                continuation.resume(returning: allowed)
                            }
                        }
                    case .denied, .restricted, .notDetermined:
                        self.errorMessage = "语音识别权限被拒绝"
                        continuation.resume(returning: false)
                    @unknown default:
                        self.errorMessage = "未知的权限状态"
                        continuation.resume(returning: false)
                    }
                }
            }
        }
    }
    
    func startRecording() {
        guard let speechRecognizer = speechRecognizer, speechRecognizer.isAvailable else {
            errorMessage = "语音识别不可用"
            return
        }
        
        do {
            let audioSession = AVAudioSession.sharedInstance()
            try audioSession.setCategory(.record, mode: .measurement, options: .duckOthers)
            try audioSession.setActive(true, options: .notifyOthersOnDeactivation)
            
            recognitionRequest = SFSpeechAudioBufferRecognitionRequest()
            
            let inputNode = audioEngine.inputNode
            
            guard let recognitionRequest = recognitionRequest else {
                fatalError("Unable to create a SFSpeechAudioBufferRecognitionRequest object")
            }
            
            recognitionRequest.shouldReportPartialResults = true
            recognitionRequest.requiresOnDeviceRecognition = false
            
            recognitionTask = speechRecognizer.recognitionTask(with: recognitionRequest) { result, error in
                var isFinal = false
                
                if let result = result {
                    DispatchQueue.main.async {
                        self.recognizedText = result.bestTranscription.formattedString
                    }
                    isFinal = result.isFinal
                }
                
                if error != nil || isFinal {
                    self.audioEngine.stop()
                    inputNode.removeTap(onBus: 0)
                    
                    self.recognitionRequest = nil
                    self.recognitionTask = nil
                    
                    DispatchQueue.main.async {
                        self.isRecording = false
                    }
                }
            }
            
            let recordingFormat = inputNode.outputFormat(forBus: 0)
            inputNode.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat) { (buffer: AVAudioPCMBuffer, when: AVAudioTime) in
                self.recognitionRequest?.append(buffer)
            }
            
            audioEngine.prepare()
            try audioEngine.start()
            
            DispatchQueue.main.async {
                self.isRecording = true
                self.recognizedText = ""
                self.errorMessage = ""
            }
            
        } catch {
            DispatchQueue.main.async {
                self.errorMessage = "启动录音失败: \(error.localizedDescription)"
            }
        }
    }
    
    func stopRecording() {
        audioEngine.stop()
        recognitionRequest?.endAudio()
        
        if let inputNode = audioEngine.inputNode as? AVAudioInputNode {
            inputNode.removeTap(onBus: 0)
        }
        
        DispatchQueue.main.async {
            self.isRecording = false
        }
    }
    
    func clearText() {
        DispatchQueue.main.async {
            self.recognizedText = ""
            self.errorMessage = ""
        }
    }
}