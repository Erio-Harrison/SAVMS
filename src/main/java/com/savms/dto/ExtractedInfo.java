package com.savms.dto;

import java.util.List;

public class ExtractedInfo {

    private List<String> vehiclePlates;
    private List<String> userIds;
    private List<String> taskIds;
    private String originalMessage;

    public ExtractedInfo() {
    }

    public ExtractedInfo(String originalMessage) {
        this.originalMessage = originalMessage;
    }

    public List<String> getVehiclePlates() {
        return vehiclePlates;
    }

    public void setVehiclePlates(List<String> vehiclePlates) {
        this.vehiclePlates = vehiclePlates;
    }

    public List<String> getUserIds() {
        return userIds;
    }

    public void setUserIds(List<String> userIds) {
        this.userIds = userIds;
    }

    public List<String> getTaskIds() {
        return taskIds;
    }

    public void setTaskIds(List<String> taskIds) {
        this.taskIds = taskIds;
    }

    public String getOriginalMessage() {
        return originalMessage;
    }

    public void setOriginalMessage(String originalMessage) {
        this.originalMessage = originalMessage;
    }

    @Override
    public String toString() {
        return "ExtractedInfo{" +
                "vehiclePlates=" + vehiclePlates +
                ", userIds=" + userIds +
                ", taskIds=" + taskIds +
                ", originalMessage='" + originalMessage + '\'' +
                '}';
    }
}