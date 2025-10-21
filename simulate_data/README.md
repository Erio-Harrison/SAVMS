# SAVMS Data Simulation System

This module provides data simulation for the Smart Autonomous Vehicle Management System (SAVMS). It generates and receives simulated vehicle telemetry and anomaly events. The system consists of two Python scripts: a data generator (sender) and a data receiver (consumer/visualizer).

## File Structure

- `simulator_sender.py` — Data generator: produces vehicle telemetry and anomaly events
- `simulator_receive.py` — Data receiver: watches directories, reads JSON, and prints/displays data

## Installation

Requires Python 3 and one third-party dependency:

```bash
pip install watchdog
```

`watchdog` is used to monitor filesystem changes so the receiver can detect new data batches.

## Usage

### Step 1: Start the data generator

```bash
python simulator_sender.py
```

### Step 2: Start the data receiver

```bash
python simulator_receive.py
```

To print detailed telemetry, enable verbose mode:

```bash
python simulator_receive.py --verbose
```

## Sender Parameters

- `--output` Output directory (default: `savms_data`)
- `--rate` Generation interval in milliseconds (default: `1000`)
- `--anomaly-prob` Probability of anomaly events in percent (default: `5`)
- `--speed` Simulation speed multiplier (default: `1`)

Example: generate data every 500 ms, 10% anomaly probability, at 10x real-time speed:

```bash
python simulator_sender.py --rate 500 --anomaly-prob 10 --speed 10
```

## Receiver Parameters

- `--input` Input directory (default: `savms_data`)
- `--verbose` or `-v` Enable verbose output

## Data Directory Layout

```
savms_data/
  live/                    # Real-time data (latest state)
    telemetry.json         # Latest state for all vehicles
    anomaly.json           # Latest anomaly event(s)

  batch_0/                 # Historical batch (example)
    telemetry.json         # Telemetry for that batch
    anomaly.json           # Anomalies for that batch

  batch_1/
  ...
```

## Data Examples

### Telemetry

```json
{
  "vehicle_id": "V001",
  "timestamp": 1647245678901,
  "data_type": "telemetry",
  "mode": "cruising",
  "battery": {
    "soc": 85.3,
    "temperature": 32.6,
    "cycle_count": 157,
    "voltage": 390.5,
    "current": -45.2
  },
  "motor": {
    "temperature": 45.3,
    "efficiency": 92.1,
    "load": 50.2,
    "rpm": 3000,
    "torque": 120.5
  },
  "sensors": {
    "acceleration": { "x": 0.12, "y": -0.05, "z": 9.8 },
    "gps": {
      "latitude": 39.9042,
      "longitude": 116.4074,
      "altitude": 48.6,
      "speed": 65.8,
      "heading": 120.5
    },
    "gyroscope": { "x": 0.01, "y": 0.03, "z": -0.02 }
  }
}
```

### Anomaly

```json
{
  "vehicle_id": "V001",
  "timestamp": 1647245679012,
  "data_type": "anomaly",
  "anomaly_type": "motor",
  "details": {
    "temperature": 85.3,
    "efficiency_drop": 12.5,
    "vibration": 8.7,
    "severity": 2
  }
}
```

## Troubleshooting

If you encounter file read/write errors, it may be due to filesystem contention:

1. Start the receiver after the sender
2. Reduce data generation rate (increase `--rate` value)
3. Ensure the output directory exists and is writable
4. On Windows, run the terminal as Administrator if permission errors occur

## Integrating with Spring Boot

Keep the simulator scripts running independently to decouple them from the backend:

1. The sender writes JSON files to `savms_data/` periodically or in real time
2. The backend watches or periodically scans these files and parses JSON
3. Map parsed data to domain objects and persist or forward to the frontend

Consider encapsulating file scanning and parsing in a service layer or scheduled task for maintainability and testability.
