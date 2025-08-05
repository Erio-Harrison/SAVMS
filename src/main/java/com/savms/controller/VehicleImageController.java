package com.savms.controller;

import com.mongodb.client.gridfs.model.GridFSFile;
import com.savms.entity.Vehicle;
import com.savms.service.VehicleService;
import com.savms.utils.Result;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
public class VehicleImageController {

    @Autowired
    private GridFsTemplate gridFsTemplate;
    @Autowired
    private GridFsOperations gridFsOperations;
    @Autowired
    private VehicleService vehicleService;

    @PostMapping("/vehicles/{vehicleId}/upload")
    public Result<?> uploadVehicleImages(@PathVariable String vehicleId,
                                         @RequestParam("photos") MultipartFile[] files) {
        try {
            List<String> fileUrls = new ArrayList<>();

            for (MultipartFile file : files) {
                if (file.isEmpty()) continue;

                ObjectId fileId = gridFsTemplate.store(
                        file.getInputStream(),
                        file.getOriginalFilename(),
                        file.getContentType()
                );
                String fileUrl = "http://localhost:8080/image/" + fileId.toHexString();
                fileUrls.add(fileUrl);
            }

            Optional<Vehicle> optionalVehicle = vehicleService.getVehicleByVehicleId(vehicleId);
            if (optionalVehicle.isEmpty()) {
                return Result.error("车辆未找到");
            }

            Vehicle vehicle = optionalVehicle.get();
            if (vehicle.getImages() == null) {
                vehicle.setImages(new ArrayList<>());
            }
            vehicle.getImages().addAll(fileUrls);
            System.out.println(vehicle.getImages().toString());
            vehicleService.save(vehicle); // 确保你有保存逻辑

            return Result.success(fileUrls);
        } catch (IOException e) {
            return Result.error("上传失败: " + e.getMessage());
        }
    }

    @GetMapping("/image/{id}")
    public ResponseEntity<?> getImage(@PathVariable String id) {
        try {
            GridFSFile file = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(id)));
            if (file == null) {
                return ResponseEntity.notFound().build();
            }

            GridFsResource resource = gridFsOperations.getResource(file);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(resource.getContentType()))
                    .body(new InputStreamResource(resource.getInputStream()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("读取失败");
        }
    }

    @DeleteMapping("/vehicles/{vehicleId}/image/{imageId}")
    public Result<?> deleteVehicleImage(@PathVariable String vehicleId,
                                        @PathVariable String imageId) {
        try {
            Optional<Vehicle> optionalVehicle = vehicleService.getVehicleByVehicleId(vehicleId);
            if (optionalVehicle.isEmpty()) {
                return Result.error("车辆未找到");
            }

            Vehicle vehicle = optionalVehicle.get();
            List<String> images = vehicle.getImages();
            String fileUrl = "http://localhost:8080/image/" + imageId;
            if (images == null || !images.remove(fileUrl)) {
                return Result.error("图片在车辆记录中未找到");
            }

            // Remove from MongoDB GridFS
            gridFsTemplate.delete(new Query(Criteria.where("_id").is(new ObjectId(imageId))));

            // Update vehicle record
            vehicleService.save(vehicle);

            return Result.success("图片删除成功");
        } catch (Exception e) {
            return Result.error("删除失败: " + e.getMessage());
        }
    }
}
