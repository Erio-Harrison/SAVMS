//
//  BottomPanelView.swift
//  SAVMS
//
//  Created by Renken G on 5/8/2025.
//

import SwiftUI

struct BottomPanelView: View {
  var body: some View {
    VStack {
       Capsule()
         .frame(width: 40, height: 6)
         .foregroundColor(.gray)
         .padding(.top, 8)
       Spacer()
       Text("More content here…")
    }
    .background(Color.white)
    .cornerRadius(16, corners: [.topLeft, .topRight])  // using custom extension
    .ignoresSafeArea(edges: .bottom)
  }
}
