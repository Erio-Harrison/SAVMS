//
//  MainTabView.swift
//  SAVMS
//
//  Created by Renken G on 29/7/2025.
//

import SwiftUI

struct MainTabView: View {
    @State private var selectedTab = 0
    @State private var showPanel = false

    // track menu open state
    @State private var menuOpened = false

    var body: some View {
        TabView(selection: $selectedTab) {
            GoogleMapView()
        }
        .sheet(isPresented: $showPanel) {
            BottomPanelView()
                .interactiveDismissDisabled() // disable swipe-down dismissal
                .presentationDetents([.fraction(0.1), .medium, .large])
                .presentationDragIndicator(.visible)
                .presentationBackgroundInteraction(.enabled(upThrough: .medium))
            
        }
        .onAppear {
            // Optionally open panel to minimal state
            showPanel = true
        }
        .overlay(alignment: .topLeading) {
            Menu {
                Button("Home") { }
                Button("Location") { }
                Button("Tasks") { }
                Button("Profile") { }
                Button("Setting") { }
            } label: {
                Image(systemName: "line.horizontal.3")
                  .font(.title2)
                  .foregroundColor(menuOpened ? .white : .gray)
                  .padding()
                  .background(
                    Circle()
                      .fill(menuOpened ? Color.blue : Color.white)
                  )
                  .onTapGesture {
                    menuOpened.toggle()
                  }
              }
              .contentShape(Circle())  // Make full circle tappable
              .padding(16)
        }
    }
}


#Preview {
    MainTabView()
}
