//
//  MapView.swift
//  SAVMS
//
//  Created by Renken G on 29/7/2025.
//
import SwiftUI

struct MainTabView: View {
  @State private var selectedTab = 0

  var body: some View {
      TabView(selection: /*@START_MENU_TOKEN@*//*@PLACEHOLDER=Selection@*/.constant(1)/*@END_MENU_TOKEN@*/) {
          Text("Tab Content 1").tabItem { /*@START_MENU_TOKEN@*/Text("Tab Label 1")/*@END_MENU_TOKEN@*/ }.tag(1)
          Text("Tab Content 2").tabItem { /*@START_MENU_TOKEN@*/Text("Tab Label 2")/*@END_MENU_TOKEN@*/ }.tag(2)
      }
  }
}
#Preview {
    MainTabView()
}
