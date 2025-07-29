import SwiftUI

// —— 模型定义 ——

/// 登录请求的 Payload
struct LoginRequest: Codable {
    let username: String
    let password: String
    let role: Int
}

/// 后端返回的通用结构：code=1 表示成功，其它或 data=nil 表示失败
struct LoginResponse: Codable {
    let code: Int         // 后端状态码：1 成功，0 或其它表示失败
    let msg: String?      // 后端提示信息（登录成功时可能为 null）
    let data: LoginData?  // 登录成功时不为 nil
}

/// 登录后真正的数据
struct LoginData: Codable {
    let token: String
    let id: String
    let username: String
    let email: String
    let role: Int
}

// —— 视图 ——

struct ContentView: View {
    // — UI 状态
    @State private var username     = ""
    @State private var password     = ""
    @State private var userType     = "client"
    @State private var isLoggedIn   = false
    @State private var errorMessage = ""
    @State private var showAlert    = false

    let userTypes = ["client", "admin"]

    var body: some View {
        Group {
            if isLoggedIn {
                MainTabView()
            } else {
                loginForm
            }
        }
        .animation(.default, value: isLoggedIn)
    }

    /// 登录表单
    private var loginForm: some View {
        VStack(spacing: 30) {
            Text("SAVMS")
                .font(.system(size: 60, weight: .bold))

            HStack(spacing: 40) {
                Image("wifi")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 80, height: 80)
                Image("car")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 80, height: 80)
            }

            TextField("Username", text: $username)
                .padding()
                .background(Color(red: 239/255, green: 233/255, blue: 199/255))
                .cornerRadius(8)

            SecureField("Password", text: $password)
                .padding()
                .background(Color(red: 239/255, green: 233/255, blue: 199/255))
                .cornerRadius(8)

            Picker("User Type", selection: $userType) {
                ForEach(userTypes, id: \.self) { Text($0.capitalized) }
            }
            .pickerStyle(SegmentedPickerStyle())

            Button("Login") {
                login()
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(Color(red: 199/255, green: 172/255, blue: 63/255))
            .foregroundColor(.black)
            .cornerRadius(8)
        }
        .padding(40)
        .background(Color(red: 250/255, green: 248/255, blue: 231/255))
        .alert("Login Error", isPresented: $showAlert) {
            Button("OK", role: .cancel) { }
        } message: {
            Text(errorMessage)
        }
    }

    /// 核心登录逻辑
    func login() {
        guard let url = URL(string: "http://localhost:8080/api/auth/login") else {
            errorMessage = "Invalid URL"
            showAlert = true
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        // 构造请求体
        let payload = LoginRequest(
            username: username,
            password: password,
            role: userType == "admin" ? 0 : 1
        )
        do {
            let bodyData = try JSONEncoder().encode(payload)
            request.httpBody = bodyData
            // 调试：打印请求 JSON
            print("→ Request JSON:", String(data: bodyData, encoding: .utf8)!)
        } catch {
            errorMessage = "Encode error: \(error.localizedDescription)"
            showAlert = true
            return
        }

        // 发起请求
        URLSession.shared.dataTask(with: request) { data, resp, err in
            DispatchQueue.main.async {
                // 网络层错误
                if let e = err {
                    errorMessage = "Network error: \(e.localizedDescription)"
                    showAlert = true
                    return
                }
                // HTTP 状态码检查
                guard let http = resp as? HTTPURLResponse,
                      (200...299).contains(http.statusCode) else {
                    errorMessage = "Server error"
                    showAlert = true
                    return
                }
                // 数据非空
                guard let d = data else {
                    errorMessage = "No data received"
                    showAlert = true
                    return
                }
                // 解析 JSON
                do {
                    let res = try JSONDecoder().decode(LoginResponse.self, from: d)
                    // 后端约定 code == 1 且 data != nil 即登录成功
                    if res.code == 1, res.data != nil {
                        isLoggedIn = true
                    } else {
                        errorMessage = res.msg ?? "Login failed"
                        showAlert = true
                    }
                } catch {
                    let raw = String(data: d, encoding: .utf8) ?? ""
                    errorMessage = "Decode error: \(error.localizedDescription)\nRaw: \(raw)"
                    showAlert = true
                }
            }
        }
        .resume()
    }
}

#Preview {
    ContentView()
}
