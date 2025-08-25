import random
import time
import math
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, Tuple
from bson import ObjectId
from vehicle_config_loader import VehicleConfig

class EnhancedVehicleModel:
    """增强版车辆数据模型类 - 支持真实物理模拟"""
    
    def __init__(self, config: VehicleConfig):
        """
        初始化车辆
        :param config: 车辆配置对象
        """
        self.config = config
        self.vehicle_id = config.id
        self.license_plate = config.license_plate
        
        # 初始化位置和运动状态
        self.current_longitude = config.initial_position['longitude']
        self.current_latitude = config.initial_position['latitude']
        self.current_speed = 0.0  # 当前速度 km/h
        self.target_speed = config.driving_behavior['preferredSpeed']  # 目标速度
        self.current_direction = random.uniform(0, 360)  # 当前方向（度）
        
        # 用户设置目标速度的标志
        self.user_set_target_speed = False
        self.user_target_speed = None
        
        # 初始化能源状态
        self.current_energy = config.energy_config['initialEnergy']
        self.is_charging = False
        self.charging_start_time = None
        
        # 初始化驾驶状态
        self.is_resting = False
        self.rest_start_time = None
        self.rest_duration = 0
        
        # 运动历史（用于计算加速度等）
        self.last_update_time = datetime.utcnow()
        self.last_speed = 0.0
        self.direction_change_timer = 0
        
        # MongoDB ObjectId
        self.object_id = None
        
        # 传感器基准值
        self._init_sensor_baselines()
        
    def _init_sensor_baselines(self):
        """初始化传感器基准值"""
        self.sensor_baselines = {}
        for sensor, range_values in self.config.sensor_ranges.items():
            if len(range_values) == 2:
                self.sensor_baselines[sensor] = random.uniform(range_values[0], range_values[1])
            else:
                self.sensor_baselines[sensor] = 0.0
    
    def set_object_id(self, object_id):
        """设置MongoDB的ObjectId"""
        self.object_id = object_id
    
    def set_user_target_speed(self, speed: float):
        """
        设置用户指定的目标速度
        :param speed: 用户设置的目标速度 km/h
        """
        max_speed = self.config.movement_config['maxSpeed']
        self.user_target_speed = max(0, min(max_speed, speed))
        self.user_set_target_speed = True
    
    def update_physics(self, time_delta: float):
        """
        更新物理状态
        :param time_delta: 时间增量（秒）
        """
        # 检查是否需要休息
        self._update_rest_status(time_delta)
        
        # 更新能源状态
        self._update_energy_status(time_delta)
        
        # 如果在充电或休息，不进行移动
        if self.is_charging or self.is_resting:
            self.current_speed = 0.0
            return
        
        # 更新速度（考虑加速度）
        self._update_speed(time_delta)
        
        # 更新方向
        self._update_direction(time_delta)
        
        # 更新位置
        self._update_position(time_delta)
        
        # 更新方向变化计时器
        self.direction_change_timer += time_delta
    
    def _update_rest_status(self, time_delta: float):
        """更新休息状态"""
        if not self.is_resting:
            # 检查是否应该开始休息
            if random.random() < self.config.driving_behavior['restProbability'] * time_delta / 60:
                self.is_resting = True
                self.rest_start_time = datetime.utcnow()
                self.rest_duration = random.uniform(
                    *self.config.driving_behavior['restDuration']
                )
        else:
            # 检查是否应该结束休息
            if datetime.utcnow() - self.rest_start_time >= timedelta(seconds=self.rest_duration):
                self.is_resting = False
                self.rest_start_time = None
    
    def _update_energy_status(self, time_delta: float):
        """更新能源状态"""
        energy_config = self.config.energy_config
        
        if self.is_charging:
            # 充电逻辑
            charge_amount = energy_config['chargingRate'] * time_delta / 60  # 每分钟充电速率
            charge_amount *= energy_config['chargingEfficiency']  # 充电效率
            
            self.current_energy = min(
                energy_config['maxEnergy'],
                self.current_energy + charge_amount
            )
            
            # 检查是否充满
            if self.current_energy >= energy_config['maxEnergy'] * 0.95:  # 95%即可停止充电
                self.is_charging = False
                self.charging_start_time = None
        else:
            # 电量消耗逻辑
            if self.current_speed > 0:
                # 基于速度和加速度计算消耗
                base_consumption = energy_config['consumptionRate'] * time_delta / 60
                speed_factor = (self.current_speed / 100) ** 1.5  # 速度越快消耗越多
                acceleration_factor = abs(self.current_speed - self.last_speed) / time_delta / 10 + 1
                
                consumption = base_consumption * speed_factor * acceleration_factor
                self.current_energy = max(0, self.current_energy - consumption)
            
            # 检查是否需要充电
            if self.current_energy <= energy_config['autoChargeThreshold']:
                self.is_charging = True
                self.charging_start_time = datetime.utcnow()
    
    def _update_speed(self, time_delta: float):
        """更新速度"""
        movement_config = self.config.movement_config
        behavior_config = self.config.driving_behavior
        
        # 如果电量为0，速度为0
        if self.current_energy <= 0:
            self.current_speed = 0.0
            return
        
        # 获取驾驶行为参数（在所有分支中都需要使用）
        aggressiveness = behavior_config['aggressiveness']
        
        # 如果用户设置了目标速度，则使用用户设置的速度
        if self.user_set_target_speed and self.user_target_speed is not None:
            self.target_speed = self.user_target_speed
            self.user_set_target_speed = False # 重置标志
        else:
            # 计算目标速度（基于驾驶行为和随机性）
            base_target = behavior_config['preferredSpeed']
            speed_variation = movement_config['speedVariation']
            
            # 随机调整目标速度
            if random.random() < 0.5:  # 50%概率改变目标速度
                variation = random.uniform(-speed_variation, speed_variation)
                self.target_speed = max(0, min(movement_config['maxSpeed'], base_target + variation))
        
        # 计算速度变化
        speed_diff = self.target_speed - self.current_speed
        
        if abs(speed_diff) > 0.1:  # 如果速度差异大于0.1 km/h
            if speed_diff > 0:  # 加速
                acceleration = movement_config['acceleration'] * (1 + aggressiveness)
                speed_change = acceleration * time_delta
                self.current_speed = min(self.target_speed, self.current_speed + speed_change)
            else:  # 减速
                deceleration = movement_config['deceleration'] * (1 + aggressiveness)
                speed_change = deceleration * time_delta
                self.current_speed = max(self.target_speed, self.current_speed - speed_change)
        
        # 确保速度在合理范围内
        self.current_speed = max(0, min(movement_config['maxSpeed'], self.current_speed))
    
    def _update_direction(self, time_delta: float):
        """更新移动方向"""
        movement_config = self.config.movement_config
        
        # 定期改变方向
        if self.direction_change_timer >= movement_config['directionChangeInterval']:
            direction_change = random.uniform(-45, 45)  # ±45度范围内改变方向
            self.current_direction = (self.current_direction + direction_change) % 360
            self.direction_change_timer = 0
        
        # 小幅随机方向调整
        if random.random() < 0.3:  # 30%概率小幅调整方向
            small_change = random.uniform(-5, 5)
            self.current_direction = (self.current_direction + small_change) % 360
    
    def _update_position(self, time_delta: float):
        """更新位置"""
        if self.current_speed <= 0:
            return
        
        movement_config = self.config.movement_config
        
        # 计算移动距离（km）
        distance_km = self.current_speed * time_delta / 3600  # km/h * h = km
        
        # 转换为经纬度变化
        # 1度经度 ≈ 111km * cos(latitude)
        # 1度纬度 ≈ 111km
        lat_rad = math.radians(self.current_latitude)
        
        # 计算经纬度变化
        direction_rad = math.radians(self.current_direction)
        
        delta_lat = distance_km * math.cos(direction_rad) / 111.0
        delta_lng = distance_km * math.sin(direction_rad) / (111.0 * math.cos(lat_rad))
        
        # 更新位置
        new_latitude = self.current_latitude + delta_lat
        new_longitude = self.current_longitude + delta_lng
        
        # 检查是否超出移动半径
        initial_lat = self.config.initial_position['latitude']
        initial_lng = self.config.initial_position['longitude']
        
        distance_from_origin = self._calculate_distance(
            initial_lat, initial_lng, new_latitude, new_longitude
        )
        
        if distance_from_origin <= movement_config['movementRadius']:
            self.current_latitude = new_latitude
            self.current_longitude = new_longitude
        else:
            # 如果超出范围，调整方向朝向原点
            self.current_direction = self._calculate_bearing_to_origin()
    
    def _calculate_distance(self, lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        """
        计算两点间距离（度）
        :return: 距离（度）
        """
        return math.sqrt((lat2 - lat1) ** 2 + (lng2 - lng1) ** 2)
    
    def _calculate_bearing_to_origin(self) -> float:
        """
        计算朝向原点的方向
        :return: 方向角度
        """
        initial_lat = self.config.initial_position['latitude']
        initial_lng = self.config.initial_position['longitude']
        
        delta_lng = initial_lng - self.current_longitude
        delta_lat = initial_lat - self.current_latitude
        
        bearing = math.degrees(math.atan2(delta_lng, delta_lat))
        return (bearing + 360) % 360
    
    def generate_sensor_data(self) -> Dict[str, float]:
        """生成传感器数据"""
        sensor_data = {}
        
        for sensor, baseline in self.sensor_baselines.items():
            # 基于车辆状态调整传感器数据
            if sensor == 'engineCondition':
                # 引擎状态基于电量和速度
                energy_factor = self.current_energy / 100
                speed_factor = 1.0 - (self.current_speed / self.config.movement_config['maxSpeed']) * 0.1
                condition_base = baseline * energy_factor * speed_factor
            elif sensor in ['coolantTemp', 'lubeOilTemp']:
                # 温度基于速度和电量
                speed_factor = 1.0 + (self.current_speed / 100) * 0.3
                energy_factor = 1.0 + (1.0 - self.current_energy / 100) * 0.2
                condition_base = baseline * speed_factor * energy_factor
            elif sensor in ['coolantPressure']:
                # 压力基于速度
                speed_factor = 1.0 + (self.current_speed / 100) * 0.2
                condition_base = baseline * speed_factor
            else:
                condition_base = baseline
            
            # 添加随机波动
            variation = random.uniform(-0.05, 0.05)  # ±5%波动
            final_value = condition_base * (1 + variation)
            
            # 确保在合理范围内
            sensor_range = self.config.sensor_ranges[sensor]
            if len(sensor_range) == 2:
                final_value = max(sensor_range[0], min(sensor_range[1], final_value))
            
            sensor_data[sensor] = round(final_value, 2)
        
        return sensor_data
    
    def generate_dynamic_data(self) -> Dict[str, Any]:
        """
        生成动态变化的车辆数据
        :return: 包含所有车辆数据的字典
        """
        current_time = datetime.utcnow()
        time_delta = (current_time - self.last_update_time).total_seconds()
        
        # 更新物理状态
        self.update_physics(time_delta)
        
        # 生成传感器数据
        sensor_data = self.generate_sensor_data()
        
        # 确定状态
        connection_status = 1
        task_status = 1 if self.current_speed > 0 else 0
        health_status = 1 if self.current_energy > 10 else 0
        
        # 组合所有数据
        vehicle_data = {
            # 静态数据
            "licensePlate": self.config.license_plate,
            "carModel": self.config.car_model,
            "year": self.config.year,
            "energyType": self.config.energy_type,
            "length": self.config.dimensions['length'],
            "width": self.config.dimensions['width'],
            "height": self.config.dimensions['height'],
            "radarModel": self.config.equipment['radarModel'],
            "radarCount": self.config.equipment['radarCount'],
            "cameraModel": self.config.equipment['cameraModel'],
            "cameraCount": self.config.equipment['cameraCount'],
            "_class": "com.savms.entity.Vehicle",
            
            # 动态数据
            "longitude": round(self.current_longitude, 6),
            "latitude": round(self.current_latitude, 6),
            "location": {
                "type": "Point",
                "coordinates": [self.current_longitude, self.current_latitude]
            },
            "speed": round(self.current_speed, 2),
            "leftoverEnergy": round(self.current_energy, 2),
            "connectionStatus": connection_status,
            "taskStatus": task_status,
            "healthStatus": health_status,
            
            # 传感器数据
            **sensor_data,
            
            # 额外状态信息
            "isCharging": self.is_charging,
            "isResting": self.is_resting,
            "direction": round(self.current_direction, 1),
            "targetSpeed": round(self.target_speed, 2),
            
            # 时间戳
            "lastUpdated": current_time
        }
        
        # 如果有ObjectId，保留它
        if self.object_id:
            vehicle_data["_id"] = self.object_id
        
        # 更新历史数据
        self.last_update_time = current_time
        self.last_speed = self.current_speed
        
        return vehicle_data
    
    def get_status_summary(self) -> str:
        """获取车辆状态摘要"""
        status_parts = []
        
        if self.is_charging:
            status_parts.append("充电中")
        elif self.is_resting:
            status_parts.append("休息中")
        elif self.current_speed > 0:
            status_parts.append(f"行驶中({self.current_speed:.1f}km/h)")
        else:
            status_parts.append("停止")
        
        status_parts.append(f"电量{self.current_energy:.1f}%")
        
        return " | ".join(status_parts)
    
    def __str__(self):
        return f"EnhancedVehicle({self.license_plate}, {self.get_status_summary()})" 