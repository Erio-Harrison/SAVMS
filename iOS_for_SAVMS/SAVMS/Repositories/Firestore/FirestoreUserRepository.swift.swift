//
//  FirestoreUserRepository.swift.swift
//  SAVMS
//
//  Created by Renken G on 19/8/2025.
//

// Repositories/Firestore/FirestoreUserRepository.swift
import Foundation
import FirebaseFirestore

final class FirestoreUserRepository: UserRepository {
    private let db = Firestore.firestore()
    private let collection = "users"

    // MARK: - Mapping helpers

    private func mapDocument(_ doc: DocumentSnapshot) throws -> User {
        guard let data = doc.data() else {
            throw NSError(domain: "UserRepo", code: 404, userInfo: [NSLocalizedDescriptionKey: "User not found"])
        }

        // Firestore stores dates as Timestamp
        let createdAtTS = data["createdAt"] as? Timestamp
        let createdAt = createdAtTS?.dateValue() ?? Date(timeIntervalSince1970: 0)

        let user = User(
            id: doc.documentID,
            username: data["username"] as? String ?? "",
            email: data["email"] as? String ?? "",
            createdAt: createdAt,
            password: data["password"] as? String ?? "", // ⚠️ consider not exposing/storing plaintext
            role: data["role"] as? Int ?? 0
        )
        return user
    }

    private func encodeFields(from user: User) -> [String: Any] {
        [
            "username": user.username,
            "email": user.email,
            "createdAt": Timestamp(date: user.createdAt),
            "password": user.password,   // ⚠️ avoid plaintext in production; use Firebase Auth
            "role": user.role
        ]
    }

    // MARK: - API

    func fetchUser(byDocumentID id: String) async throws -> User {
        try await withCheckedThrowingContinuation { cont in
            db.collection(collection).document(id).getDocument { snapshot, error in
                if let error = error { return cont.resume(throwing: error) }
                guard let snapshot = snapshot, snapshot.exists else {
                    return cont.resume(throwing: NSError(domain: "UserRepo", code: 404, userInfo: [NSLocalizedDescriptionKey: "User not found"]))
                }
                do {
                    cont.resume(returning: try self.mapDocument(snapshot))
                } catch {
                    cont.resume(throwing: error)
                }
            }
        }
    }

    func fetchUser(byUsername username: String) async throws -> User? {
        try await withCheckedThrowingContinuation { cont in
            db.collection(collection)
                .whereField("username", isEqualTo: username)
                .limit(to: 1)
                .getDocuments { snap, err in
                    if let err = err { return cont.resume(throwing: err) }
                    guard let doc = snap?.documents.first else { return cont.resume(returning: nil) }
                    do {
                        cont.resume(returning: try self.mapDocument(doc))
                    } catch {
                        cont.resume(throwing: error)
                    }
                }
        }
    }

    func fetchUser(byEmail email: String) async throws -> User? {
        try await withCheckedThrowingContinuation { cont in
            db.collection(collection)
                .whereField("email", isEqualTo: email)
                .limit(to: 1)
                .getDocuments { snap, err in
                    if let err = err { return cont.resume(throwing: err) }
                    guard let doc = snap?.documents.first else { return cont.resume(returning: nil) }
                    do {
                        cont.resume(returning: try self.mapDocument(doc))
                    } catch {
                        cont.resume(throwing: error)
                    }
                }
        }
    }

    func createUser(_ user: User) async throws -> String {
        try await withCheckedThrowingContinuation { cont in
            var fields = encodeFields(from: user)
            // createdAt default if not set
            if fields["createdAt"] == nil {
                fields["createdAt"] = Timestamp(date: Date())
            }

            var ref: DocumentReference?
            ref = db.collection(collection).addDocument(data: fields) { error in
                if let error = error { return cont.resume(throwing: error) }
                cont.resume(returning: ref?.documentID ?? "")
            }
        }
    }

    func updateUser(id: String, fields: [String: Any]) async throws {
        try await withCheckedThrowingContinuation { (cont: CheckedContinuation<Void, Error>) in
            db.collection(collection).document(id).updateData(fields) { err in
                if let err = err {
                    cont.resume(throwing: err)
                } else {
                    cont.resume(returning: ())
                }
            }
        }
    }

    func deleteUser(id: String) async throws {
        try await withCheckedThrowingContinuation { (cont: CheckedContinuation<Void, Error>) in
            db.collection(collection).document(id).delete { err in
                if let err = err {
                    cont.resume(throwing: err)
                } else {
                    cont.resume(returning: ())
                }
            }
        }
    }
}
