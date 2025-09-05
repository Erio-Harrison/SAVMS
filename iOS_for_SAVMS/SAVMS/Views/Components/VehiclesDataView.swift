//
//  VehiclesDataView.swift
//  SAVMS
//
//  Created by Renken G on 5/9/2025.
//


import SwiftUI

struct VehiclesDataView: View {
    @EnvironmentObject var vehicleStore: VehicleStore
    @State private var hasLoaded = false
    @State private var showAlert = false
    @State private var errorMessage = ""

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 16) {
                    if vehicleStore.isLoading {
                        ProgressView("Loading…")
                            .padding(.top)
                    }

                    if !vehicleStore.vehicles.isEmpty {
                        VStack(alignment: .leading, spacing: 10) {
                            Text("Vehicles data: (\(vehicleStore.vehicles.count))")
                                .font(.headline)
                                .padding(.horizontal)

                            ForEach(vehicleStore.vehicles, id: \.id) { vehicle in
                                VehicleRowView(vehicle: vehicle)
                            }
                        }
                    } else if !vehicleStore.isLoading {
                        Text("No vehicle data found.")
                            .foregroundColor(.secondary)
                            .padding(.top, 24)
                    }

                    Spacer(minLength: 24)
                }
            }
            .navigationTitle("Vehicles Data")
            .alert("error", isPresented: $showAlert) {
                Button("OK") { }
            } message: {
                Text(errorMessage)
            }
            .onAppear {
                if !hasLoaded {
                    hasLoaded = true
                    vehicleStore.fetchAllVehicles()     // ✅ use shared store
                }
            }
            .refreshable {
                vehicleStore.fetchAllVehicles()
            }
            .onChange(of: vehicleStore.error) { err in
                if let e = err {
                    errorMessage = e.localizedDescription
                    showAlert = true
                }
            }
        }
    }
}

#Preview {
    VehiclesDataView()
        .environmentObject(VehicleStore()) // preview supply a store
}
