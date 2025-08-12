//
//  MainTabView.swift
//  SAVMS
//
//  Created by Renken G on 29/7/2025.
//

import SwiftUI

struct MainTabView: View {
    var body: some View {
        GeometryReader { geo in
            let h = geo.size.height
            let panelH = h * 0.8

            ZStack(alignment: .bottom) {
                // Your full-screen content (e.g., Google map)
                GoogleMapView()
                    .ignoresSafeArea()

                BottomPanelView(panelHeight: panelH) {
                    Text("Panel content goes here")
                        .font(.headline)
                        .padding(.horizontal)
                    // Add your list, buttons, etc.
                }
                .padding(.horizontal)
            }
        }
    }
}


#Preview {
    MainTabView()
}
