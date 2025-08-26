import random
import time
from datetime import datetime
from typing import Dict, Any
from bson import ObjectId

class VehicleModel:
    """车辆数据模型类"""
    
    def __init__(self, vehicle_id: str, license_plate: str):
        """
        初始化车辆
        :param vehicle_id: 车辆ID
        :param license_plate: 车牌号
        """
        self.vehicle_id = vehicle_id
        self.license_plate = license_plate
        
        # 初始化静态数据（不经常变化的属性）
        self._init_static_data()
        
        # 初始化动态数据的基准值
        self._init_dynamic_base_values()
    
    def _init_static_data(self):
        """初始化静态车辆数据"""
        car_models = ["Tesla Model 3", "BYD Han", "NIO ES6", "BMW X5", "Audi A6"]
        energy_types = ["Electric", "Hybrid", "Gasoline"]
        radar_models = ["Radar X 2000", "LiDAR Pro", "UltraSonic 360"]
        camera_models = ["CamX HD", "Vision Pro", "SmartCam 4K"]
        
        self.static_data = {
            "licensePlate": self.license_plate,
            "carModel": random.choice(car_models),
            "year": random.randint(2020, 2024),
            "energyType": random.choice(energy_types),
            "length": random.randint(4, 6),
            "width": random.randint(1, 3),
            "height": random.randint(1, 3),
            "radarModel": random.choice(radar_models),
            "radarCount": random.randint(2, 8),
            "cameraModel": random.choice(camera_models),
            "cameraCount": random.randint(1, 6),
            "_class": "com.savms.entity.Vehicle"
        }
    
    def _init_dynamic_base_values(self):
        """初始化动态数据的基准值"""
        from config import Config
        
        # 位置基准值
        self.base_longitude = random.uniform(*Config.LOCATION_RANGE['longitude'])
        self.base_latitude = random.uniform(*Config.LOCATION_RANGE['latitude'])
        
        # 速度基准值
        self.base_speed = random.uniform(30, 80)
        
        # 传感器基准值
        self.base_sensors = {
            'leftoverEnergy': random.uniform(20, 100),
            'engineRPM': random.uniform(1000, 3000),
            'lubeOilPressure': random.uniform(20, 60),
            'fuelPressure': random.uniform(30, 70),
            'coolantPressure': random.uniform(10, 50),
            'lubeOilTemp': random.uniform(60, 100),
            'coolantTemp': random.uniform(70, 90),
            'engineCondition': random.uniform(80, 100)
        }
        
        # 状态基准值
        self.connection_status = 1
        self.task_status = 0
        self.health_status = 0
    
    def generate_dynamic_data(self) -> Dict[str, Any]:
        """
        生成动态变化的车辆数据
        :return: 包含所有车辆数据的字典
        """
        from config import Config
        
        # 生成位置数据（模拟车辆移动）
        longitude_delta = random.uniform(-0.001, 0.001)
        latitude_delta = random.uniform(-0.001, 0.001)
        current_longitude = self.base_longitude + longitude_delta
        current_latitude = self.base_latitude + latitude_delta
        
        # 更新基准位置（模拟持续移动）
        self.base_longitude = current_longitude
        self.base_latitude = current_latitude
        
        # 生成速度数据（在基准速度附近波动）
        speed_delta = random.uniform(-10, 10)
        current_speed = max(0, min(200, self.base_speed + speed_delta))
        
        # 生成传感器数据（在基准值附近波动）
        current_sensors = {}
        for sensor, base_value in self.base_sensors.items():
            sensor_range = Config.SENSOR_RANGES[sensor]
            delta_percent = random.uniform(-0.1, 0.1)  # ±10%波动
            new_value = base_value * (1 + delta_percent)
            # 确保值在合理范围内
            current_sensors[sensor] = max(sensor_range[0], min(sensor_range[1], new_value))
            
            # 更新基准值（模拟缓慢变化趋势）
            self.base_sensors[sensor] = new_value
        
        # 组合所有数据
        vehicle_data = {
            **self.static_data,
            "longitude": current_longitude,
            "latitude": current_latitude,
            "location": {
                "type": "Point",
                "coordinates": [current_longitude, current_latitude]
            },
            "speed": round(current_speed, 2),
            "connectionStatus": self.connection_status,
            "taskStatus": self.task_status,
            "healthStatus": self.health_status,
            **{k: round(v, 2) for k, v in current_sensors.items()},
            "lastUpdated": datetime.utcnow()
        }
        
        # 如果有ObjectId，保留它
        if hasattr(self, 'object_id'):
            vehicle_data["_id"] = self.object_id
        
        return vehicle_data
    
    def set_object_id(self, object_id):
        """设置MongoDB的ObjectId"""
        self.object_id = object_id
    
    def __str__(self):
        return f"Vehicle({self.license_plate}, {self.static_data['carModel']})" 