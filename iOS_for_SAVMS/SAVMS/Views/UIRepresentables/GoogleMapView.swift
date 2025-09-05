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

    final class Coordinator: NSObject, GMSMapViewDelegate {
        var markersById: [String: GMSMarker] = [:]
        var didFitOnce = false

        // Custom info window
        func mapView(_ mapView: GMSMapView, markerInfoWindow marker: GMSMarker) -> UIView? {
            guard let v = marker.userData as? BackendVehicle else { return nil }
            let card = MarkerInfoCard(vehicle: v)
            // Ensure proper size for Google Maps
            let size = card.systemLayoutSizeFitting(UIView.layoutFittingCompressedSize)
            card.frame = CGRect(origin: .zero, size: size)
            card.layoutIfNeeded()
            return card
        }
    }

    func makeCoordinator() -> Coordinator { Coordinator() }

    func makeUIView(context: Context) -> GMSMapView {
        let options = GMSMapViewOptions()
        options.camera = GMSCameraPosition.camera(
            withLatitude: -33.86, longitude: 151.20, zoom: 10
        )
        let mapView = GMSMapView(options: options)
        mapView.isMyLocationEnabled = true
        mapView.settings.myLocationButton = true
        mapView.delegate = context.coordinator               // ✅ enable custom info window
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
                CATransaction.begin()
                CATransaction.setAnimationDuration(0.25)
                marker.position = coord
                marker.title = "\(v.licensePlate) • \(v.carModel)"   // still used for accessibility
                marker.snippet = "速度 \(Int(v.speed)) km/h · 电量 \(v.leftoverEnergy)%"
                marker.icon = GMSMarker.markerImage(with: .systemRed) // ✅ red
                marker.userData = v                                   // ✅ pass data for info card
                marker.tracksInfoWindowChanges = true                 // reflect updates
                marker.map = mapView
                CATransaction.commit()
            } else {
                let marker = GMSMarker(position: coord)
                marker.title = "\(v.licensePlate) • \(v.carModel)"
                marker.snippet = "速度 \(Int(v.speed)) km/h · 电量 \(v.leftoverEnergy)%"
                marker.icon = GMSMarker.markerImage(with: .systemRed) // ✅ red
                marker.userData = v                                   // ✅ for custom card
                marker.appearAnimation = .pop
                marker.tracksInfoWindowChanges = true
                marker.map = mapView
                context.coordinator.markersById[v.id] = marker
            }

            bounds = bounds.includingCoordinate(coord)
            hasAny = true
        }

        // Fit camera once on first successful load
        if hasAny && !context.coordinator.didFitOnce {
            context.coordinator.didFitOnce = true
            let insets = UIEdgeInsets(top: 80, left: 40, bottom: 160, right: 40)
            mapView.animate(with: GMSCameraUpdate.fit(bounds, with: insets))
        }
    }
}

// MARK: - Pretty Info Window (UIKit view)

final class MarkerInfoCard: UIView {
    init(vehicle v: BackendVehicle) {
        super.init(frame: .zero)
        backgroundColor = UIColor.secondarySystemBackground
        layer.cornerRadius = 12
        layer.masksToBounds = true
        layer.borderColor = UIColor.black.withAlphaComponent(0.06).cgColor
        layer.borderWidth = 1

        let title = UILabel()
        title.font = .preferredFont(forTextStyle: .headline)
        title.text = "\(v.licensePlate) • \(v.carModel)"
        title.numberOfLines = 1

        // ✅ renamed from Chip -> InfoPill
        let speedChip = InfoPill(text: "速度 \(Int(v.speed)) km/h", color: .systemBlue)
        let batteryChip = InfoPill(text: "电量 \(v.leftoverEnergy)%", color: MarkerInfoCard.batteryColor(v.leftoverEnergy))

        let chipsRow = UIStackView(arrangedSubviews: [speedChip, batteryChip])
        chipsRow.axis = .horizontal
        chipsRow.spacing = 8
        chipsRow.alignment = .leading
        chipsRow.distribution = .fillProportionally

        let coords = UILabel()
        coords.font = .preferredFont(forTextStyle: .caption1)
        coords.textColor = .secondaryLabel
        coords.text = "(\(format(v.latitude)), \(format(v.longitude)))"

        let stack = UIStackView(arrangedSubviews: [title, chipsRow, coords])
        stack.axis = .vertical
        stack.spacing = 8
        stack.translatesAutoresizingMaskIntoConstraints = false

        addSubview(stack)
        NSLayoutConstraint.activate([
            stack.topAnchor.constraint(equalTo: topAnchor, constant: 12),
            stack.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 12),
            stack.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -12),
            stack.bottomAnchor.constraint(equalTo: bottomAnchor, constant: -12),
            stack.widthAnchor.constraint(lessThanOrEqualToConstant: 260)
        ])
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }

    private func format(_ d: Double) -> String { String(format: "%.5f", d) }

    private static func batteryColor(_ pct: Int) -> UIColor {
        switch pct {
        case ..<20: return .systemRed
        case 20..<50: return .systemOrange
        default: return .systemGreen
        }
    }
}

// MARK: - Small pill chip

final class InfoPill: UIView {
    init(text: String, color: UIColor) {
        super.init(frame: .zero)

        let label = UILabel()
        label.text = text
        label.font = .preferredFont(forTextStyle: .caption1).bold()
        label.textColor = color

        let capsule = UIView()
        capsule.backgroundColor = color.withAlphaComponent(0.12)
        capsule.layer.cornerRadius = 10
        capsule.layer.borderWidth = 1
        capsule.layer.borderColor = color.withAlphaComponent(0.25).cgColor

        label.translatesAutoresizingMaskIntoConstraints = false
        capsule.translatesAutoresizingMaskIntoConstraints = false
        addSubview(capsule)
        addSubview(label)

        NSLayoutConstraint.activate([
            capsule.topAnchor.constraint(equalTo: topAnchor),
            capsule.leadingAnchor.constraint(equalTo: leadingAnchor),
            capsule.trailingAnchor.constraint(equalTo: trailingAnchor),
            capsule.bottomAnchor.constraint(equalTo: bottomAnchor),

            label.topAnchor.constraint(equalTo: topAnchor, constant: 4),
            label.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 8),
            label.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -8),
            label.bottomAnchor.constraint(equalTo: bottomAnchor, constant: -4)
        ])
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }
}

// Tiny helper to bold UIFont safely
private extension UIFont {
    func bold() -> UIFont {
        let desc = fontDescriptor.withSymbolicTraits(.traitBold) ?? fontDescriptor
        return UIFont(descriptor: desc, size: pointSize)
    }
}
