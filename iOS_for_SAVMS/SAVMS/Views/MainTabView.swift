//
//  MainTabView.swift
//  SAVMS
//
//  Created by Renken G on 29/7/2025.
//

import SwiftUI

struct MainTabView: View {
    @StateObject private var vehicleStore = VehicleStore()

    var body: some View {
        GeometryReader { geo in
            let h = geo.size.height
            let panelH = h * 0.8

            ZStack(alignment: .bottom) {
                GoogleMapView()
                    .environmentObject(vehicleStore)  // ✅ provide store to map
                    .ignoresSafeArea()

                BottomPanelView(panelHeight: panelH) {
                    Text("Panel content goes here")
                        .font(.headline)
                        .padding(.horizontal)
                }
                .padding(.horizontal)
            }
        }
        .overlay(alignment: .topLeading) {
            MenuButtonView()
                .environmentObject(vehicleStore)     // ✅ pass to menu (and its sheets)
        }
        .onAppear {
            // Fetch once on landing (so map shows markers even before opening the Vehicles screen)
            if vehicleStore.vehicles.isEmpty {
                vehicleStore.fetchAllVehicles()
            }
        }
    }
}

#Preview { MainTabView() }
