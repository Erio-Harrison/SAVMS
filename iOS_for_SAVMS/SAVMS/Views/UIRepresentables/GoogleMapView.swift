//
//  GoogleMapView.swift
//  SAVMS
//
//  Created by Renken G on 30/7/2025.
//

import SwiftUI
import GoogleMaps

struct GoogleMapView: UIViewRepresentable {
  func makeUIView(context: Context) -> GMSMapView {
    let camera = GMSCameraPosition.camera(withLatitude: -33.86, longitude: 151.20, zoom: 10)
    let mapView = GMSMapView.map(withFrame: .zero, camera: camera)
    mapView.isMyLocationEnabled = true
    mapView.settings.myLocationButton = true
    return mapView
  }

  func updateUIView(_ mapView: GMSMapView, context: Context) {
    let marker = GMSMarker()
    marker.position = CLLocationCoordinate2D(latitude: -33.86, longitude: 151.20)
    marker.title = "Sydney"
    marker.map = mapView
  }
}
