//
//  VehicleStore.swift
//  SAVMS
//

import Foundation
import Combine

final class VehicleStore: ObservableObject {
    @Published var vehicles: [BackendVehicle] = []
    @Published var isLoading = false
    @Published var error: APIError?

    func fetchAllVehicles() {
        guard !isLoading else { return }
        isLoading = true
        error = nil

        BackendAPIService.shared.getAllVehicles { [weak self] result in
            guard let self = self else { return }
            self.isLoading = false
            switch result {
            case .success(let v):
                self.vehicles = v
            case .failure(let e):
                self.error = e
                self.vehicles = []
            }
        }
    }
}
