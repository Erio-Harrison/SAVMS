//
//  UserRepository.swift
//  SAVMS
//
//  Created by Renken G on 19/8/2025.
//

// Repositories/Protocols/UserRepository.swift
import Foundation

protocol UserRepository {
    /// Get a user by Firestore document ID
    func fetchUser(byDocumentID id: String) async throws -> User

    /// Find a single user by username (returns nil if not found)
    func fetchUser(byUsername username: String) async throws -> User?

    /// Find a single user by email (returns nil if not found)
    func fetchUser(byEmail email: String) async throws -> User?

    /// Create a new user document; returns the new document ID
    func createUser(_ user: User) async throws -> String

    /// Update an existing user document (partial update)
    func updateUser(id: String, fields: [String: Any]) async throws

    /// Delete a user document
    func deleteUser(id: String) async throws
}
