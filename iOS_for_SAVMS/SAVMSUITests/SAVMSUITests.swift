//
//  SAVMSUITests.swift
//  SAVMSUITests
//
//  Created by Yang on 29/7/2025.
//

import XCTest

final class SAVMSUITests: XCTestCase {

    override func setUpWithError() throws {
        // Put setup code here. This method is called before the invocation of each test method in the class.

        // In UI tests it is usually best to stop immediately when a failure occurs.
        continueAfterFailure = false

        // In UI tests it’s important to set the initial state - such as interface orientation - required for your tests before they run. The setUp method is a good place to do this.
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    @MainActor
    func testTabNavigation() throws {
        let app = XCUIApplication()
        app.launch()
        
        let tabBar = app.tabBars.firstMatch
        XCTAssertTrue(tabBar.exists, "TabBar should exist")
        
        let mapTab = tabBar.buttons["Map"]
        let otherTab = tabBar.buttons["Other"]
        
        XCTAssertTrue(mapTab.exists, "Map tab should exist")
        XCTAssertTrue(otherTab.exists, "Other tab should exist")
        
        otherTab.tap()
        let otherText = app.staticTexts["Other Feature"]
        XCTAssertTrue(otherText.exists, "Other Feature text should be visible")
        
        mapTab.tap()
    }
    
    @MainActor
    func testMapViewExists() throws {
        let app = XCUIApplication()
        app.launch()
        
        let mapTab = app.tabBars.buttons["Map"]
        XCTAssertTrue(mapTab.exists, "Map tab should exist")
        
        sleep(2)
    }

    @MainActor
    func testLaunchPerformance() throws {
        // This measures how long it takes to launch your application.
        measure(metrics: [XCTApplicationLaunchMetric()]) {
            XCUIApplication().launch()
        }
    }
}
