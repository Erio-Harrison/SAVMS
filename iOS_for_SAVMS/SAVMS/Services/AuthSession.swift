//
//  AuthSession.swift
//  SAVMS
//
//  Created by Renken G on 5/9/2025.
//

import Foundation
import Combine

final class AuthSession: ObservableObject {
    static let shared = AuthSession()
    @Published var currentUser: LoginResponse?   // set after successful login
    private init() {}
}
