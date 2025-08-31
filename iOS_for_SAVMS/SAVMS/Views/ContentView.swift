//
//  ContentView.swift
//  SAVMS
//
//  Created by Yang Hu on 31/8/2025.
//

import SwiftUI

struct ContentView: View {
    // 登录表单状态
    @State private var username     = ""
    @State private var password     = ""
    @State private var userType     = "client" // 默认 client
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

    // 登录表单
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

    // 登录逻辑
    func login() {
        
        BackendAPIService.shared.signInWithUsername(
            username: username,
            password: password,
            role: userType
        ) { result in
            switch result {
            case .success(let loginResponse):
                // 登录成功，可以获取用户信息
                print("登录成功！用户：\(loginResponse.username), Token: \(loginResponse.token)")
                isLoggedIn = true
            case .failure(let error):
                errorMessage = error.localizedDescription
                showAlert = true
            }
        }
    }
}
