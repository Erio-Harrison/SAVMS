
# SAVMS API Usage Guide

## Overview

The SAVMS project uses Firebase Firestore as its database and provides user authentication and data retrieval functionality via a custom `AuthService` class.

## Project Structure

```
SAVMS/
├── Services/
│   └── DB_API.swift           # API service class
├── Views/
│   ├── ContentView.swift      # Login screen
│   └── MainTabView.swift      # Main interface
└── GoogleService-Info.plist   # Firebase configuration
```

## API Service Class Details

### `AuthService` Class (`Services/DB_API.swift`)

#### Basic Configuration
```swift
import Foundation
import FirebaseFirestore

class AuthService {
    static let shared = AuthService()
    private let db = Firestore.firestore()
}
```

#### Main Methods

##### 1. User Login Authentication
```swift
func signInWithUsername(
    username: String, 
    password: String, 
    role: String, 
    completion: @escaping (Result<Void, Error>) -> Void
)
```

**Parameters:**
- `username`: Username
- `password`: Password  
- `role`: User role ("client" or "admin")
- `completion`: Callback closure returning a success or failure result

**Workflow:**
1. Query Firestore using the `name` and `role` fields
2. Manually validate the password (supports string, integer, and float types)
3. Return the authentication result

## Database Structure

### `users` Collection
```json
{
  "name": "ABC",           // Username
  "password": 123,         // Password (can be string or number)
  "role": "admin"          // Role
}
```

## Usage Example

### Calling the API in a View

```swift
import SwiftUI

struct ContentView: View {
    @State private var username = ""
    @State private var password = ""
    @State private var userType = "client"
    @State private var isLoggedIn = false
    @State private var errorMessage = ""
    @State private var showAlert = false

    func login() {
        AuthService.shared.signInWithUsername(
            username: username,
            password: password,
            role: userType
        ) { result in
            DispatchQueue.main.async {
                switch result {
                case .success():
                    isLoggedIn = true
                    print("✅ Login successful")
                case .failure(let error):
                    errorMessage = error.localizedDescription
                    showAlert = true
                    print("❌ Login failed: \(error)")
                }
            }
        }
    }
}
```

## Extending the API

### Add a New Data Fetch Method

```swift
// Add this method to the AuthService class
func fetchVehicleData(completion: @escaping (Result<[Vehicle], Error>) -> Void) {
    db.collection("vehicles").getDocuments { snapshot, error in
        if let error = error {
            completion(.failure(error))
            return
        }
        
        guard let documents = snapshot?.documents else {
            completion(.success([]))
            return
        }
        
        // Parse vehicle data
        let vehicles = documents.compactMap { doc -> Vehicle? in
            let data = doc.data()
            return Vehicle(
                id: doc.documentID,
                name: data["name"] as? String ?? "",
                status: data["status"] as? String ?? ""
            )
        }
        
        completion(.success(vehicles))
    }
}
```

### Add Data Models

```swift
// Define data models
struct Vehicle: Identifiable, Codable {
    let id: String
    let name: String
    let status: String
}

struct User: Identifiable, Codable {
    let id: String
    let name: String
    let role: String
}
```

## Error Handling

### Common Error Types

1. **Network Errors** – Firebase connection failed  
2. **Authentication Errors** – Username, password, or role mismatch  
3. **Permission Errors** – Firebase rules restrictions

### Error Handling Best Practices

```swift
AuthService.shared.signInWithUsername(...) { result in
    DispatchQueue.main.async {
        switch result {
        case .success():
            // Handle success
            break
        case .failure(let error):
            // Handle specific error types
            if (error as NSError).code == 401 {
                // Authentication failure
                print("Incorrect username or password")
            } else {
                // Other errors
                print("System error: \(error.localizedDescription)")
            }
        }
    }
}
```

## Best Practices

1. **Singleton Pattern** – Use `AuthService.shared` to ensure a single global instance  
2. **Asynchronous Calls** – All Firestore operations are asynchronous  
3. **Main Thread Updates** – Always update the UI on the main thread  
4. **Error Handling** – Always handle potential errors  
5. **Type Safety** – Use strongly typed models instead of dictionaries

## Debugging Tips

1. **Enable Detailed Logs** – Print statements are included in the code  
2. **Check Firebase Console** – Verify data structure is correct  
3. **Verify Network Connection** – Ensure the device can access Firebase  
4. **Check Xcode Console** – Observe detailed execution logs

## Test User Data

```json
{
  "name": "ABC",
  "password": 123,
  "role": "admin"
}
```

You can use this data for login testing in the app.
