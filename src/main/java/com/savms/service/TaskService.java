package com.savms.service;

import com.savms.entity.Task;
import com.savms.entity.Vehicle;
import com.savms.dto.TaskDTO;
import com.savms.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public void saveTask(Task task) {
        taskRepository.addTask(task);
    }

    public void deleteTask(String taskId) {
        taskRepository.deleteTaskById(taskId);
    }

    public Optional<Task> getTaskById(String taskId) {
        return taskRepository.findById(taskId);
    }

    public List<Task> getAllTasks() {
        return taskRepository.getAllTasks();
    }

    public List<TaskDTO> getAllTaskDTOs() {
        return taskRepository.getAllTasks().stream().map(task -> {
            TaskDTO dto = new TaskDTO();
            dto.setId(task.getId());
            dto.setTitle(task.getTitle());
            dto.setDescription(task.getDescription());
            dto.setStartTime(task.getStartTime());
            dto.setEndTime(task.getEndTime());
            dto.setStatus(task.getStatus());
            dto.setStartLocation(task.getStartLocation());
            dto.setEndLocation(task.getEndLocation());

            Vehicle v = task.getVehicle();
            if (v != null) {
                dto.setVehicle(new TaskDTO.VehicleSummary(
                        v.getId(), v.getLicensePlate(), v.getCarModel()
                ));
            }
            return dto;
        }).collect(Collectors.toList());
    }

    public void updateTaskStatus(String taskId, int status) {
        taskRepository.updateTaskStatus(taskId, status);
    }
}