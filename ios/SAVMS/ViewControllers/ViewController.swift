import UIKit

class ViewController: UIViewController {
    
    // MARK: - Outlets
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var statusLabel: UILabel!
    @IBOutlet weak var refreshButton: UIBarButtonItem!
    
    // MARK: - Properties
    private let vehicleService = VehicleService()
    private var vehicles: [Vehicle] = []
    private var isLoading = false
    
    // MARK: - Lifecycle
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        loadVehicles()
    }
    
    // MARK: - Setup UI
    private func setupUI() {
        title = "SAVMS - Vehicles"
        
        // Setup navigation bar
        navigationItem.rightBarButtonItem = UIBarButtonItem(
            barButtonSystemItem: .refresh,
            target: self,
            action: #selector(refreshButtonTapped)
        )
        
        // Setup table view
        tableView.delegate = self
        tableView.dataSource = self
        tableView.rowHeight = UITableView.automaticDimension
        tableView.estimatedRowHeight = 120
        
        // Register cell if using prototype cells
        tableView.register(VehicleTableViewCell.self, forCellReuseIdentifier: "VehicleCell")
        
        // Setup status label
        statusLabel.text = "Loading vehicles..."
        statusLabel.textAlignment = .center
        statusLabel.numberOfLines = 0
    }
    
    // MARK: - Actions
    @objc private func refreshButtonTapped() {
        loadVehicles()
    }
    
    // MARK: - Data Loading
    private func loadVehicles() {
        guard !isLoading else { return }
        
        isLoading = true
        statusLabel.text = "Loading vehicles..."
        refreshButton.isEnabled = false
        
        vehicleService.getAllVehicles { [weak self] result in
            DispatchQueue.main.async {
                self?.isLoading = false
                self?.refreshButton.isEnabled = true
                
                switch result {
                case .success(let vehicles):
                    self?.vehicles = vehicles
                    self?.updateUI()
                case .failure(let error):
                    self?.showError(error)
                }
            }
        }
    }
    
    private func updateUI() {
        if vehicles.isEmpty {
            statusLabel.text = "No vehicles found"
            statusLabel.isHidden = false
            tableView.isHidden = true
        } else {
            statusLabel.isHidden = true
            tableView.isHidden = false
            tableView.reloadData()
        }
    }
    
    private func showError(_ error: NetworkError) {
        statusLabel.text = "Error: \(error.localizedDescription)"
        statusLabel.isHidden = false
        tableView.isHidden = true
        
        let alert = UIAlertController(
            title: "Error",
            message: error.localizedDescription,
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        alert.addAction(UIAlertAction(title: "Retry", style: .default) { _ in
            self.loadVehicles()
        })
        present(alert, animated: true)
    }
}

// MARK: - UITableViewDataSource
extension ViewController: UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return vehicles.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "VehicleCell", for: indexPath) as! VehicleTableViewCell
        let vehicle = vehicles[indexPath.row]
        cell.configure(with: vehicle)
        return cell
    }
}

// MARK: - UITableViewDelegate
extension ViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        
        let vehicle = vehicles[indexPath.row]
        showVehicleDetails(vehicle)
    }
    
    private func showVehicleDetails(_ vehicle: Vehicle) {
        let alert = UIAlertController(
            title: vehicle.licensePlate,
            message: """
            Model: \(vehicle.carModel)
            Year: \(vehicle.year)
            Energy: \(vehicle.energyPercentage)
            Speed: \(vehicle.speedFormatted)
            Status: \(vehicle.isOnline ? "Online" : "Offline")
            Health: \(vehicle.isHealthy ? "Healthy" : "Needs Attention")
            """,
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}

// MARK: - Custom Vehicle Cell
class VehicleTableViewCell: UITableViewCell {
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: .subtitle, reuseIdentifier: reuseIdentifier)
        setupCell()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupCell()
    }
    
    private func setupCell() {
        accessoryType = .disclosureIndicator
    }
    
    func configure(with vehicle: Vehicle) {
        textLabel?.text = "\(vehicle.licensePlate) - \(vehicle.carModel)"
        
        let statusText = vehicle.isOnline ? "🟢 Online" : "🔴 Offline"
        let energyText = "⚡ \(vehicle.energyPercentage)"
        let speedText = "🚗 \(vehicle.speedFormatted)"
        
        detailTextLabel?.text = "\(statusText) | \(energyText) | \(speedText)"
        detailTextLabel?.numberOfLines = 2
    }
}