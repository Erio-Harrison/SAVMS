//
//  UserModel.swift
//  SAVMS
//
//  Created by Renken G on 19/8/2025.
//

import Foundation

struct User: Identifiable, Codable {
    var id: String           // from "_id.$oid"
    var username: String
    var email: String
    var createdAt: Date
    var password: String
    var role: Int
}
