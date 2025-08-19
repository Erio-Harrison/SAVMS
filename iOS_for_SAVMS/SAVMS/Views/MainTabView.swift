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
                // Full-screen content
                GoogleMapView()
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
        }
    }
}


#Preview {
    MainTabView()
}
