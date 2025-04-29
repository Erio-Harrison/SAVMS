// 文件: Task.java
package com.savms.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Setter
@Getter
@Document(collection = "task")
public class Task {
    @Id
    private String id;

    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int status;

    private Location startLocation;
    private Location endLocation;
    private Vehicle vehicle;

    @Override
    public String toString() {
        return "Task{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", status=" + status +
                ", startLocation=" + startLocation +
                ", endLocation=" + endLocation +
                ", vehicle=" + vehicle +
                '}';
    }

}