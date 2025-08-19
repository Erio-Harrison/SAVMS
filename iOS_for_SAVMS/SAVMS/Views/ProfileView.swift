//
//  FileView.swift
//  SAVMS
//
//  Created by Renken G on 19/8/2025.
//
import SwiftUI

struct ProfileView: View {
    var body: some View {
            ZStack(alignment: .bottom) {
                // your main content, e.g. the map/panel
                Color.clear   // placeholder so the ZStack isn’t empty
            }
            .overlay(alignment: .topLeading) {
                MenuButtonView()
            }
        }
}

#Preview {
    ProfileView()
}
