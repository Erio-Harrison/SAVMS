//
//  MapView.swift
//  SAVMS
//
//  Created by Renken G on 29/7/2025.
//
import SwiftUI

import SwiftUI

struct MainTabView: View {
    @State private var selectedTab = 0

    // track menu open state
    @State private var menuOpened = false

    var body: some View {
        TabView(selection: $selectedTab) {
            GoogleMapView()
                .tag(0)
                .tabItem { Label("Map", systemImage: "map") }

            Text("Other Feature")
                .tag(1)
                .tabItem { Label("Other", systemImage: "gear") }
        }
        .overlay(alignment: .topLeading) {
            Menu {
                Button("Option 1") { }
                Button("Option 2") { }
                Button("Option 3") { }
                Button("Option 4") { }
                Button("Option 5") { }
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
