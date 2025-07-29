//
//  ContentView.swift
//  SAVMS
//
//  Created by Yang on 29/7/2025.
//

import SwiftUI

struct ContentView: View {
    
    @State private var username: String = ""
    @State private var password: String = ""
    @State private var userType: String = "client"
    let userTypes = ["client", "admin"]
    
    var body: some View {
        VStack(spacing:30){
            
            Text("SAVMS")
                .font(.system(size: 60, weight: .bold))
                .padding(.bottom, 20)
            
            TextField("username", text: $username)
                .padding()
                .background(Color(red: 239/255, green: 233/255, blue: 199/255))
                .cornerRadius(8)
            
            SecureField("password", text: $password)
                .padding()
                .background(Color(red: 239/255, green: 233/255, blue: 199/255))
                .cornerRadius(8)
            
            Picker(selection: $userType, label: Text("User Type")){
                ForEach(userTypes, id: \.self) { type in
                    Text(type).tag(type)
                }
            }
                .pickerStyle(SegmentedPickerStyle())
            
            Button("Login"){
                
            }
            .padding()
            .frame(maxWidth: .infinity)
            .background(Color(red: 199/255, green: 172/255, blue: 63/255))
            .foregroundColor(.black)
            
            
        }
        .padding(40)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(red: 250/255, green: 248/255, blue: 231/255))
    }
}

#Preview {
    ContentView()
}
