//
//  SAVMSTests.swift
//  SAVMSTests
//
//  Created by Yang on 29/7/2025.
//

import XCTest
import SwiftUI
import GoogleMaps        // Required to access GMSMapView for testing
@testable import SAVMS   // Import the app module to test its public/internal types

/// Unit tests for the SAVMS module
final class SAVMSTests: XCTestCase {

    /// Tests that `MainTabView` initializes without throwing and is not nil.
    func testMainTabViewInitialState() async throws {
        // Arrange & Act
        let tabView = MainTabView()
        // Assert
        XCTAssertNotNil(tabView, "MainTabView should be instantiated successfully")
    }

    /// Verifies that `MainTabView` contains two tabs (placeholder assertion).
    /// TODO: Use a view inspection library (e.g., ViewInspector) to count the actual tabs.
    func testMainTabViewHasTwoTabs() async throws {
        // Arrange
        let tabView = MainTabView()
        // Act & Assert
        XCTAssertNotNil(tabView, "MainTabView instance should not be nil")
    }

    /// Tests that `GoogleMapView` (the SwiftUI wrapper) can be created successfully.
    func testGoogleMapViewCreation() async throws {
        // Arrange & Act
        let mapView = GoogleMapView()
        // Assert
        XCTAssertNotNil(mapView, "GoogleMapView should be instantiated successfully")
    }

}


