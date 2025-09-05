//
//  GoogleMapView.swift
//  SAVMS
//
//  SwiftUI wrapper around GMSMapView with dynamic vehicle markers
//

import SwiftUI
import GoogleMaps

struct GoogleMapView: UIViewRepresentable {
    @EnvironmentObject var vehicleStore: VehicleStore

    final class Coordinator {
        var markersById: [String: GMSMarker] = [:]
        var didFitOnce = false
    }

    func makeCoordinator() -> Coordinator { Coordinator() }

    func makeUIView(context: Context) -> GMSMapView {
        let options = GMSMapViewOptions()
        options.camera = GMSCameraPosition.camera(
            withLatitude: -33.86,
            longitude: 151.20,
            zoom: 10
        )
        let mapView = GMSMapView(options: options)
        mapView.isMyLocationEnabled = true
        mapView.settings.myLocationButton = true
        return mapView
    }

    func updateUIView(_ mapView: GMSMapView, context: Context) {
        let vehicles = vehicleStore.vehicles

        // Remove markers for vehicles no longer present
        let currentIds = Set(vehicles.map { $0.id })
        for (id, marker) in context.coordinator.markersById where !currentIds.contains(id) {
            marker.map = nil
            context.coordinator.markersById.removeValue(forKey: id)
        }

        var bounds = GMSCoordinateBounds()
        var hasAny = false

        for v in vehicles {
            let coord = CLLocationCoordinate2D(latitude: v.latitude, longitude: v.longitude)

            if let marker = context.coordinator.markersById[v.id] {
                // Update existing marker smoothly
                CATransaction.begin()
                CATransaction.setAnimationDuration(0.25)
                marker.position = coord
                marker.title = "\(v.licensePlate) • \(v.carModel)"
                marker.snippet = "速度 \(Int(v.speed)) km/h · 电量 \(v.leftoverEnergy)%"
                marker.icon = GMSMarker.markerImage(with: markerColor(for: v))
                marker.map = mapView
                CATransaction.commit()
            } else {
                // Create new marker
                let marker = GMSMarker(position: coord)
                marker.title = "\(v.licensePlate) • \(v.carModel)"
                marker.snippet = "速度 \(Int(v.speed)) km/h · 电量 \(v.leftoverEnergy)%"
                marker.icon = GMSMarker.markerImage(with: markerColor(for: v))
                marker.appearAnimation = .pop
                marker.map = mapView
                context.coordinator.markersById[v.id] = marker
            }

            bounds = bounds.includingCoordinate(coord)
            hasAny = true
        }

        // Fit camera once on first successful load
        if hasAny && !context.coordinator.didFitOnce {
            context.coordinator.didFitOnce = true
            // Adjust insets so markers aren’t covered by your bottom panel
            let insets = UIEdgeInsets(top: 80, left: 40, bottom: 160, right: 40)
            let update = GMSCameraUpdate.fit(bounds, with: insets)
            mapView.animate(with: update)
        }
    }

    // You can tweak marker color rules here (e.g., by connectionStatus / healthStatus)
    private func markerColor(for v: BackendVehicle) -> UIColor {
        // Example heuristic:
        switch v.connectionStatus {
        case 0:  return .systemRed     // offline?
        case 1:  return .systemGreen   // online?
        default: return .systemBlue
        }
    }
}
