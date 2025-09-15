package com.savms.service;

import com.savms.entity.TaskNode;
import com.savms.entity.Vehicle;
import com.savms.repository.TaskRepository;
import com.savms.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    public void createTask(TaskNode task) {
        // Set default values if not provided
        if (task.getStatus() == 0 && task.getAssignedVehicleId() == null) {
            task.setStatus(0); // Default to pending status
        }
        if (task.getStartTime() == null) {
            task.setStartTime(LocalDateTime.now());
        }
        taskRepository.addTask(task);
    }

    public void deleteTask(String id) {
        taskRepository.deleteTaskById(id);
    }

    public Optional<TaskNode> getTaskById(String id) {
        return taskRepository.findById(id);
    }

    public List<TaskNode> getAllTasks() {
        return taskRepository.getAllTasks();
    }

    public List<TaskNode> getTasksByStatus(int status) {
        return taskRepository.findByStatus(status);
    }

    public void updateTaskStatus(String id, int status) {
        taskRepository.updateStatus(id, status);
    }

    public List<TaskNode> getTasksInTimeRange(LocalDateTime start, LocalDateTime end) {
        return taskRepository.findTasksInTimeRange(start, end);
    }

    public List<TaskNode> getTasksWithVehicleAssigned() {
        return taskRepository.findTasksWithVehicleAssigned();
    }

    public List<TaskNode> getTasksByStartLocation(String address) {
        return taskRepository.findTasksByStartLocation(address);
    }

    public void assignTaskToVehicle(String taskId, String vehicleId) {
        Optional<TaskNode> taskOpt = taskRepository.findById(taskId);
        Optional<Vehicle> vehicleOpt = vehicleRepository.findByVehicleId(vehicleId);

        if (taskOpt.isEmpty()) {
            throw new RuntimeException("Task not found with ID: " + taskId);
        }
        if (vehicleOpt.isEmpty()) {
            throw new RuntimeException("Vehicle not found with ID: " + vehicleId);
        }

        TaskNode task = taskOpt.get();
        Vehicle vehicle = vehicleOpt.get();

        if (vehicle.getTaskStatus() != 0) {
            throw new RuntimeException("Vehicle is already assigned to another task");
        }

        task.setStatus(1);
        task.setAssignedVehicleId(vehicleId);

        TaskNode.VehicleInfo vehicleInfo = new TaskNode.VehicleInfo();
        vehicleInfo.setVehicleNumber(vehicleId);
        vehicleInfo.setPlateNumber(vehicle.getLicensePlate());
        task.setVehicle(vehicleInfo);

        TaskNode.Location vehicleLocation = new TaskNode.Location();
        vehicleLocation.setLat(vehicle.getLatitude());
        vehicleLocation.setLng(vehicle.getLongitude());
        vehicleLocation.setAddress("Current Vehicle Position");
        task.setVehicleLocation(vehicleLocation);

        vehicle.setTaskStatus(1);

        taskRepository.addTask(task);
        vehicleRepository.saveVehicle(vehicle);
    }

    public void unassignTask(String taskId) {
        Optional<TaskNode> taskOpt = taskRepository.findById(taskId);
        if (taskOpt.isEmpty()) {
            throw new RuntimeException("Task not found with ID: " + taskId);
        }

        TaskNode task = taskOpt.get();
        String vehicleId = task.getAssignedVehicleId();

        if (vehicleId != null) {
            Optional<Vehicle> vehicleOpt = vehicleRepository.findByVehicleId(vehicleId);
            if (vehicleOpt.isPresent()) {
                Vehicle vehicle = vehicleOpt.get();
                vehicle.setTaskStatus(0);
                vehicleRepository.saveVehicle(vehicle);
            }
        }

        task.setStatus(0);
        task.setAssignedVehicleId(null);
        task.setVehicle(null);
        task.setVehicleLocation(null);

        taskRepository.addTask(task);
    }

    public List<Vehicle> getAvailableVehicles() {
        return vehicleRepository.getAllVehicles().stream()
                .filter(vehicle -> vehicle.getTaskStatus() == 0 &&
                               vehicle.getConnectionStatus() == 1 &&
                               vehicle.getHealthStatus() == 1)
                .collect(Collectors.toList());
    }
}