//
//  MenuButtonView.swift
//  SAVMS
//
//  Created by Renken G on 19/8/2025.
//

import SwiftUI

struct MenuButtonView: View {
    var body: some View {
        Menu {
            Button("Home") { /* action */ }
            Button("Location") { /* action */ }
            Button("Tasks") { /* action */ }
            Button("Profile") { /* action */ }
            Button("Settings") { /* action */ }
        } label: {
            Image(systemName: "line.horizontal.3")
                .font(.title2)
                .frame(width: 44, height: 44)  // big tap target
                .background(
                    Circle()
                        .fill(.ultraThickMaterial)
                        .shadow(radius: 4, y: 2)
                )
        }
        .buttonStyle(.plain)       // avoid extra button tinting
        .contentShape(Circle())    // whole circle is tappable
        .padding(.leading, 16)
        .padding(.top, 16)
        .zIndex(2)                 // keep above bottom panel
    }
}

