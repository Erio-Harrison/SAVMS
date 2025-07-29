# SAVMS iOS App

This is the iOS client application for the Smart Autonomous Vehicle Management System (SAVMS).

## Overview

The iOS app provides a native mobile interface to interact with the SAVMS backend system, allowing users to:

- View all vehicles in the fleet
- Monitor vehicle status (online/offline, health, energy levels)
- View real-time vehicle information including location, speed, and sensor data
- Access vehicle details and diagnostic information

## Architecture

The iOS app follows a standard iOS architecture pattern:

- **Models**: Data structures that match the backend API (Vehicle, etc.)
- **Services**: Network layer for API communication
  - `NetworkService`: Generic HTTP client for API requests
  - `VehicleService`: Vehicle-specific API endpoints
- **ViewControllers**: UI layer for displaying data
  - `ViewController`: Main vehicle list view

## Requirements

- iOS 15.0+
- Xcode 15.0+
- Swift 5.0+

## Setup

1. Open `SAVMS.xcodeproj` in Xcode
2. Configure the backend URL in `NetworkService.swift`:
   ```swift
   private let baseURL = "http://your-backend-server:8080"
   ```
3. Build and run the project

## API Integration

The app communicates with the SAVMS backend through REST APIs:

- `GET /vehicles/all` - Get all vehicles
- `GET /vehicles/get/{id}` - Get vehicle by ID
- `POST /vehicles/create` - Create new vehicle
- `PUT /vehicles/update` - Update vehicle
- `DELETE /vehicles/delete/{id}` - Delete vehicle

## Features

### Vehicle List
- Displays all vehicles with basic information
- Shows real-time status indicators (online/offline)
- Energy level and speed information
- Pull-to-refresh functionality

### Vehicle Details
- Detailed vehicle information including:
  - Basic info (license plate, model, year)
  - Status information (connection, health, tasks)
  - Sensor data (speed, energy, location)
  - Engine diagnostics

## Configuration

### Network Configuration
Update the `baseURL` in `NetworkService.swift` to point to your SAVMS backend server.

### App Transport Security
The app is configured to allow arbitrary loads for development. For production, update the `NSAppTransportSecurity` settings in `Info.plist`.

## Development

### Project Structure
```
ios/
├── SAVMS.xcodeproj/           # Xcode project file
└── SAVMS/                     # Source code
    ├── Models/                # Data models
    │   └── Vehicle.swift
    ├── Services/              # Network and business logic
    │   ├── NetworkService.swift
    │   └── VehicleService.swift
    ├── ViewControllers/       # UI controllers
    │   └── ViewController.swift
    ├── Base.lproj/           # Storyboards
    │   ├── Main.storyboard
    │   └── LaunchScreen.storyboard
    ├── Assets.xcassets/      # App icons and colors
    ├── AppDelegate.swift     # App lifecycle
    ├── SceneDelegate.swift   # Scene management
    └── Info.plist           # App configuration
```

### Adding New Features
1. Add new model classes in `Models/`
2. Extend `NetworkService` for new API endpoints
3. Create new service classes for business logic
4. Add new view controllers for UI

## Troubleshooting

### Network Issues
- Ensure the backend server is running and accessible
- Check the `baseURL` configuration in `NetworkService.swift`
- Verify network permissions in `Info.plist`

### Build Issues
- Clean build folder (Product → Clean Build Folder)
- Check Xcode version compatibility
- Verify iOS deployment target settings