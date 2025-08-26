//
//  DB_API.swift
//  SAVMS
//
//  Created by Yang on 5/8/2025.
//

// VehicleService.swift

import Foundation
import FirebaseFirestore

class AuthService {
    static let shared = AuthService()
    private let db = Firestore.firestore()
    
    struct User: Identifiable {
        var id: String        // Firestore doc ID
        var userID: String
        var name: String
        var email: String
        var role: String
    }
    
    /// 直接用 Firestore 验证 name + password + role
    func signInWithUsername(username: String, password: String, role: String, completion: @escaping (Result<Void, Error>) -> Void) {
        
        print("🔍 查询用户 - name: \(username), password: \(password), role: \(role)")
        print("🔍 期望数据 - name: ABC, password: 123, role: admin")
        
        // 先按用户名和角色查询，然后手动验证密码（处理数字/字符串类型问题）
        db.collection("users")
            .whereField("name", isEqualTo: username)
            .whereField("role", isEqualTo: role)
            .getDocuments { snapshot, error in
                
                if let error = error {
                    print("❌ Firestore查询失败: \(error.localizedDescription)")
                    completion(.failure(error))
                    return
                }
                
                guard let documents = snapshot?.documents, !documents.isEmpty else {
                    print("❌ 未找到用户: name=\(username), role=\(role)")
                    let err = NSError(domain: "", code: 401, userInfo: [NSLocalizedDescriptionKey: "用户名或角色错误"])
                    completion(.failure(err))
                    return
                }
                
                print("✅ 找到 \(documents.count) 个匹配的用户")
                
                // 检查密码（处理数字和字符串两种情况）
                for document in documents {
                    let data = document.data()
                    print("📄 用户数据: \(data)")
                    
                    let storedPassword = data["password"]
                    
                    // 处理密码可能是数字或字符串的情况
                    var passwordMatch = false
                    
                    if let passwordString = storedPassword as? String {
                        passwordMatch = (passwordString == password)
                        print("🔍 字符串密码比较: '\(passwordString)' == '\(password)' -> \(passwordMatch)")
                    } else if let passwordNumber = storedPassword as? Int {
                        passwordMatch = (String(passwordNumber) == password)
                        print("🔍 数字密码比较: \(passwordNumber) == '\(password)' -> \(passwordMatch)")
                    } else if let passwordNumber = storedPassword as? Double {
                        passwordMatch = (String(Int(passwordNumber)) == password)
                        print("🔍 浮点密码比较: \(passwordNumber) == '\(password)' -> \(passwordMatch)")
                    }
                    
                    if passwordMatch {
                        print("✅ 密码验证成功！")
                        let user = User(
                            id: document.documentID,
                            userID: data["userID"] as? String ?? "",
                            name: data["name"] as? String ?? "",
                            email: data["email"] as? String ?? "",
                            role: data["role"] as? String ?? ""
                        )
                        completion(.success(()))
                        return
                    }
                }
                
                print("❌ 密码验证失败")
                let err = NSError(domain: "", code: 401, userInfo: [NSLocalizedDescriptionKey: "密码错误"])
                completion(.failure(err))
            }
    }
}
