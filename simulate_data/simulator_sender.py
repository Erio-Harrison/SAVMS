#!/usr/bin/env python3
import json
import math
import random
import time
import os
import datetime
import argparse
from enum import Enum
from typing import Dict, List, Optional

# 车辆操作模式
class VehicleMode(Enum):
    IDLE = "idle"
    ACCELERATING = "accelerating" 
    CRUISING = "cruising"
    DECELERATING = "decelerating"
    CHARGING = "charging"

# 车辆状态类
class VehicleState:
    def __init__(self, vehicle_id):
        self.id = vehicle_id
        
        # 电池参数
        self.battery_soc = random.uniform(70.0, 95.0)  # 电池电量 (%)
        self.battery_temp = random.uniform(20.0, 25.0)  # 电池温度 (°C)
        self.cycle_count = random.randint(10, 200)  # 充电循环次数
        self.voltage = 380.0 + (self.battery_soc - 70.0) * 0.2  # 电压 (V)
        self.current = 0.0  # 电流 (A)
        
        # 电机参数
        self.motor_temp = random.uniform(25.0, 30.0)  # 电机温度 (°C)
        self.motor_efficiency = 95.0  # 电机效率 (%)
        self.motor_load = 0.0  # 电机负载 (%)
        self.rpm = 0.0  # 转速
        self.torque = 0.0  # 扭矩 (Nm)
        
        # 位置和运动参数
        self.latitude = random.uniform(39.8, 40.0)  # 纬度 (北京区域)
        self.longitude = random.uniform(116.3, 116.5)  # 经度 (北京区域)
        self.altitude = random.uniform(43.0, 55.0)  # 海拔 (m)
        self.speed = 0.0  # 速度 (km/h)
        self.heading = random.uniform(0.0, 359.9)  # 方向 (度)
        self.acc_x, self.acc_y, self.acc_z = 0.0, 0.0, 0.0  # 加速度 (m/s^2)
        self.gyro_x, self.gyro_y, self.gyro_z = 0.0, 0.0, 0.0  # 角速度 (rad/s)
        
        # 车辆运行状态
        self.mode = VehicleMode.IDLE  # 当前模式
        self.mode_duration = 0  # 当前模式持续时间 (秒)
        self.ambient_temp = random.uniform(15.0, 30.0)  # 环境温度 (°C)
        self.has_anomaly = False  # 是否存在异常
        self.anomaly_type = ""  # 异常类型
        self.anomaly_severity = 0  # 异常严重程度 (1-3)
        self.anomaly_progress = 0.0  # 异常发展程度 (0-1)
    
    def update(self, delta_time_sec):
        """更新车辆状态"""
        # 更新模式持续时间
        self.mode_duration += delta_time_sec
        
        # 可能切换模式
        self._update_mode(delta_time_sec)
        
        # 根据当前模式更新参数
        if self.mode == VehicleMode.IDLE:
            self._update_idle(delta_time_sec)
        elif self.mode == VehicleMode.ACCELERATING:
            self._update_accelerating(delta_time_sec)
        elif self.mode == VehicleMode.CRUISING:
            self._update_cruising(delta_time_sec)
        elif self.mode == VehicleMode.DECELERATING:
            self._update_decelerating(delta_time_sec)
        elif self.mode == VehicleMode.CHARGING:
            self._update_charging(delta_time_sec)
        
        # 更新电池温度 (受电机温度和环境温度影响)
        self.battery_temp = self.battery_temp * 0.95 + (0.02 * self.motor_temp + 0.03 * self.ambient_temp)
        
        # 更新电机效率 (受温度和负载影响)
        self.motor_efficiency = 95.0 - (self.motor_temp - 25.0) * 0.1 - abs(self.motor_load - 60.0) * 0.05
        self.motor_efficiency = max(75.0, min(95.0, self.motor_efficiency))
        
        # 更新位置
        if self.speed > 0:
            # 转换速度为m/s
            speed_ms = self.speed * 1000.0 / 3600.0
            # 计算位移
            distance = speed_ms * delta_time_sec
            # 更新位置 (简单模拟, 不考虑地球曲率)
            heading_rad = self.heading * math.pi / 180.0
            self.latitude += distance * math.cos(heading_rad) * 9e-6  # 简化的转换因子
            self.longitude += distance * math.sin(heading_rad) * 1.1e-5  # 简化的转换因子
        
        # 处理异常事件
        self._update_anomalies(delta_time_sec)
    
    def generate_telemetry_json(self):
        """生成遥测数据JSON"""
        # 基本信息
        telemetry = {
            "vehicle_id": self.id,
            "timestamp": int(time.time() * 1000),
            "data_type": "telemetry",
            "mode": self.mode.value,
            
            # 电池状态
            "battery": {
                "soc": round(self.battery_soc, 1),
                "temperature": round(self.battery_temp, 1),
                "cycle_count": self.cycle_count,
                "voltage": round(self.voltage, 1),
                "current": round(self.current, 1)
            },
            
            # 电机参数
            "motor": {
                "temperature": round(self.motor_temp, 1),
                "efficiency": round(self.motor_efficiency, 1),
                "load": round(self.motor_load, 1),
                "rpm": int(self.rpm),
                "torque": round(self.torque, 1)
            },
            
            # 传感器数据
            "sensors": {
                "acceleration": {
                    "x": round(self.acc_x, 2),
                    "y": round(self.acc_y, 2),
                    "z": round(self.acc_z, 2)
                },
                "gps": {
                    "latitude": self.latitude,
                    "longitude": self.longitude,
                    "altitude": self.altitude,
                    "speed": round(self.speed, 1),
                    "heading": round(self.heading, 1)
                },
                "gyroscope": {
                    "x": round(self.gyro_x, 2),
                    "y": round(self.gyro_y, 2),
                    "z": round(self.gyro_z, 2)
                }
            }
        }
        
        return telemetry
    
    def generate_anomaly_json(self):
        """生成异常事件数据JSON"""
        if not self.has_anomaly:
            return None  # 没有异常
        
        # 基本信息
        anomaly = {
            "vehicle_id": self.id,
            "timestamp": int(time.time() * 1000),
            "data_type": "anomaly",
            "anomaly_type": self.anomaly_type,
            "details": {}
        }
        
        # 根据异常类型填充详情
        if self.anomaly_type == "battery":
            anomaly["details"] = {
                "temperature": round(self.battery_temp, 1),
                "voltage_drop": round((380.0 + (self.battery_soc - 70.0) * 0.2 - self.voltage) * 100 / self.voltage, 1),
                "severity": self.anomaly_severity
            }
        elif self.anomaly_type == "motor":
            anomaly["details"] = {
                "temperature": round(self.motor_temp, 1),
                "efficiency_drop": round((95.0 - self.motor_efficiency), 1),
                "vibration": round(5.0 + self.anomaly_progress * 10.0, 1),
                "severity": self.anomaly_severity
            }
        elif self.anomaly_type == "communication":
            anomaly["details"] = {
                "packet_loss": round(30.0 + self.anomaly_progress * 70.0),
                "latency_spike": round(500.0 + self.anomaly_progress * 1500.0),
                "connection_drops": int(3 + self.anomaly_progress * 7),
                "severity": self.anomaly_severity
            }
        elif self.anomaly_type == "gps":
            anomaly["details"] = {
                "position_jump": round(100.0 + self.anomaly_progress * 900.0),
                "signal_loss": self.anomaly_progress > 0.7,
                "heading_inconsistency": round(30.0 + self.anomaly_progress * 150.0),
                "severity": self.anomaly_severity
            }
        
        return anomaly
    
    def _update_mode(self, delta_time_sec):
        """更新车辆模式"""
        # 根据当前模式和持续时间决定是否转换
        if self.mode == VehicleMode.IDLE:
            if self.mode_duration > random.randint(5, 20):
                # 从空闲状态转换为加速或充电
                if self.battery_soc < 30.0 or random.randint(1, 100) <= 10:
                    self.mode = VehicleMode.CHARGING
                else:
                    self.mode = VehicleMode.ACCELERATING
                self.mode_duration = 0
        
        elif self.mode == VehicleMode.ACCELERATING:
            if self.speed >= random.uniform(50.0, 80.0) or self.mode_duration > random.randint(10, 30):
                self.mode = VehicleMode.CRUISING
                self.mode_duration = 0
        
        elif self.mode == VehicleMode.CRUISING:
            if self.mode_duration > random.randint(60, 300):
                # 从巡航转为减速或继续巡航
                if random.randint(1, 100) <= 70:
                    self.mode = VehicleMode.DECELERATING
                    self.mode_duration = 0
                else:
                    # 改变方向，继续巡航
                    self.heading += random.uniform(-30.0, 30.0)
                    if self.heading < 0:
                        self.heading += 360
                    if self.heading >= 360:
                        self.heading -= 360
        
        elif self.mode == VehicleMode.DECELERATING:
            if self.speed < 5.0:
                self.mode = VehicleMode.IDLE
                self.mode_duration = 0
        
        elif self.mode == VehicleMode.CHARGING:
            if self.battery_soc >= 90.0 or self.mode_duration > random.randint(600, 1800):
                self.mode = VehicleMode.IDLE
                self.mode_duration = 0
                
                # 增加充电循环计数
                self.cycle_count += 1
    
    def _update_idle(self, delta_time_sec):
        """更新空闲状态"""
        # 空闲状态下逐渐减速至0
        self.speed = max(0.0, self.speed - 5.0 * delta_time_sec)
        
        # 更新电机参数
        self.motor_load = 0.0
        self.rpm = 0.0
        self.torque = 0.0
        
        # 电机温度缓慢冷却
        self.motor_temp = self.motor_temp * 0.98 + self.ambient_temp * 0.02
        
        # 电池静态放电 (非常缓慢)
        self.battery_soc = max(0.0, self.battery_soc - 0.001 * delta_time_sec)
        
        # 电流接近0
        self.current = random.uniform(-1.0, 1.0)
        
        # 加速度和角速度接近0
        self.acc_x = random.uniform(-0.1, 0.1)
        self.acc_y = random.uniform(-0.1, 0.1)
        self.acc_z = random.uniform(9.7, 9.9)  # 重力加速度
        self.gyro_x = random.uniform(-0.05, 0.05)
        self.gyro_y = random.uniform(-0.05, 0.05)
        self.gyro_z = random.uniform(-0.05, 0.05)
    
    def _update_accelerating(self, delta_time_sec):
        """更新加速状态"""
        # 加速 (根据当前速度动态调整加速度)
        acceleration = 10.0 * max(0.0, 1.0 - self.speed / 100.0)
        self.speed += acceleration * delta_time_sec
        
        # 限制最高速度
        self.speed = min(120.0, self.speed)
        
        # 更新电机参数
        self.motor_load = 40.0 + self.speed * 0.5
        self.rpm = self.speed * 50.0
        self.torque = 100.0 + self.speed * 0.5
        
        # 电机温度上升
        self.motor_temp += self.motor_load * 0.01 * delta_time_sec
        
        # 电池放电
        consumption_rate = 0.008 + self.motor_load * 0.0002
        self.battery_soc = max(0.0, self.battery_soc - consumption_rate * delta_time_sec)
        
        # 更新电流 (负值表示放电)
        self.current = -50.0 - self.motor_load * 0.5
        
        # 加速度和角速度
        self.acc_x = acceleration * 0.3 * math.cos(self.heading * math.pi / 180.0)
        self.acc_y = acceleration * 0.3 * math.sin(self.heading * math.pi / 180.0)
        self.acc_z = 9.8
        self.gyro_x = random.uniform(-0.1, 0.1)
        self.gyro_y = random.uniform(-0.1, 0.1)
        self.gyro_z = random.uniform(-0.05, 0.2)
    
    def _update_cruising(self, delta_time_sec):
        """更新巡航状态"""
        # 速度微调
        self.speed += random.uniform(-1.0, 1.0) * delta_time_sec
        
        # 限制速度范围
        self.speed = max(40.0, min(100.0, self.speed))
        
        # 更新电机参数
        self.motor_load = 30.0 + self.speed * 0.3
        self.rpm = self.speed * 50.0
        self.torque = 50.0 + self.speed * 0.3
        
        # 电机温度稳定但略有波动
        self.motor_temp = self.motor_temp * 0.99 + (30.0 + self.motor_load * 0.2) * 0.01
        
        # 电池放电
        consumption_rate = 0.005 + self.motor_load * 0.0001
        self.battery_soc = max(0.0, self.battery_soc - consumption_rate * delta_time_sec)
        
        # 更新电流 (负值表示放电)
        self.current = -30.0 - self.motor_load * 0.3
        
        # 加速度和角速度
        self.acc_x = random.uniform(-0.3, 0.3)
        self.acc_y = random.uniform(-0.3, 0.3)
        self.acc_z = 9.8
        self.gyro_x = random.uniform(-0.1, 0.1)
        self.gyro_y = random.uniform(-0.1, 0.1)
        self.gyro_z = random.uniform(-0.1, 0.1)
    
    def _update_decelerating(self, delta_time_sec):
        """更新减速状态"""
        # 减速
        deceleration = 5.0 + self.speed * 0.1
        self.speed = max(0.0, self.speed - deceleration * delta_time_sec)
        
        # 更新电机参数
        self.motor_load = max(0.0, self.motor_load - 10.0 * delta_time_sec)
        self.rpm = self.speed * 50.0
        self.torque = max(0.0, self.torque - 20.0 * delta_time_sec)
        
        # 电机温度缓慢降低
        self.motor_temp = self.motor_temp * 0.99 + (25.0 + self.ambient_temp) * 0.01
        
        # 电池放电率降低
        consumption_rate = 0.003 + self.motor_load * 0.0001
        self.battery_soc = max(0.0, self.battery_soc - consumption_rate * delta_time_sec)
        
        # 更新电流 (负值表示放电)
        self.current = -20.0 - self.motor_load * 0.2
        
        # 加速度和角速度
        self.acc_x = -deceleration * 0.3 * math.cos(self.heading * math.pi / 180.0)
        self.acc_y = -deceleration * 0.3 * math.sin(self.heading * math.pi / 180.0)
        self.acc_z = 9.8
        self.gyro_x = random.uniform(-0.1, 0.1)
        self.gyro_y = random.uniform(-0.1, 0.1)
        self.gyro_z = random.uniform(-0.2, 0.05)
    
    def _update_charging(self, delta_time_sec):
        """更新充电状态"""
        # 速度为0
        self.speed = 0.0
        
        # 更新电机参数
        self.motor_load = 0.0
        self.rpm = 0.0
        self.torque = 0.0
        
        # 电机温度接近环境温度
        self.motor_temp = self.motor_temp * 0.98 + self.ambient_temp * 0.02
        
        # 电池充电
        charge_rate = 0.02
        self.battery_soc = min(100.0, self.battery_soc + charge_rate * delta_time_sec)
        
        # 更新电流 (正值表示充电)
        self.current = 40.0 + random.uniform(-5.0, 5.0)
        
        # 电压缓慢上升
        self.voltage = 380.0 + (self.battery_soc - 70.0) * 0.2
        
        # 加速度和角速度接近0
        self.acc_x = random.uniform(-0.05, 0.05)
        self.acc_y = random.uniform(-0.05, 0.05)
        self.acc_z = 9.8
        self.gyro_x = random.uniform(-0.02, 0.02)
        self.gyro_y = random.uniform(-0.02, 0.02)
        self.gyro_z = random.uniform(-0.02, 0.02)
    
    def _update_anomalies(self, delta_time_sec):
        """更新异常状态"""
        # 如果当前有异常，更新异常进展
        if self.has_anomaly:
            self.anomaly_progress += 0.01 * delta_time_sec
            
            # 异常发展到最大程度
            if self.anomaly_progress >= 1.0:
                # 有小概率自行恢复
                if random.randint(1, 100) <= 10:
                    self.has_anomaly = False
                    self.anomaly_type = ""
                    self.anomaly_severity = 0
                    self.anomaly_progress = 0.0
                else:
                    # 否则保持在最大异常状态
                    self.anomaly_progress = 1.0
            
            # 根据异常类型应用效果
            self._apply_anomaly_effects()
        # 可能生成新的异常
        elif random.randint(1, 10000) <= 5:  # 大约每2000次更新产生一次异常
            self.has_anomaly = True
            self.anomaly_progress = 0.1
            self.anomaly_severity = random.randint(1, 3)
            
            # 选择异常类型，受车辆状态影响
            anomaly_choice = random.randint(1, 100)
            
            # 高速行驶更可能出现电机问题
            if self.speed > 80.0 and anomaly_choice <= 40:
                self.anomaly_type = "motor"
            # 电量低更可能出现电池问题
            elif self.battery_soc < 30.0 and anomaly_choice <= 70:
                self.anomaly_type = "battery"
            # 充电状态更可能出现电池问题
            elif self.mode == VehicleMode.CHARGING and anomaly_choice <= 60:
                self.anomaly_type = "battery"
            # 其他情况随机选择
            elif anomaly_choice <= 30:
                self.anomaly_type = "motor"
            elif anomaly_choice <= 60:
                self.anomaly_type = "battery"
            elif anomaly_choice <= 85:
                self.anomaly_type = "communication"
            else:
                self.anomaly_type = "gps"
    
    def _apply_anomaly_effects(self):
        """应用异常效果"""
        if self.anomaly_type == "battery":
            # 电池异常：温度升高，电压不稳定
            self.battery_temp += 0.2 * self.anomaly_progress * self.anomaly_severity
            self.voltage = self.voltage * (1.0 - 0.05 * self.anomaly_progress * self.anomaly_severity)
        
        elif self.anomaly_type == "motor":
            # 电机异常：温度升高，效率下降
            self.motor_temp += 0.5 * self.anomaly_progress * self.anomaly_severity
            self.motor_efficiency -= 10.0 * self.anomaly_progress * self.anomaly_severity
        
        elif self.anomaly_type == "communication":
            # 通信异常：数据丢包，无需模拟具体效果
            pass
        
        elif self.anomaly_type == "gps":
            # GPS异常：位置和方向不准确
            if random.randint(1, 100) <= 30 * self.anomaly_progress * self.anomaly_severity:
                self.latitude += random.uniform(-0.001, 0.001) * self.anomaly_severity
                self.longitude += random.uniform(-0.001, 0.001) * self.anomaly_severity
                self.heading += random.uniform(-10.0, 10.0) * self.anomaly_severity

class VehicleSimulator:
    def __init__(self, output_dir="savms_data", data_rate=1000, anomaly_prob=5, simulation_speed=1):
        self.output_dir = output_dir
        self.data_rate = data_rate  # 数据生成间隔 (毫秒)
        self.anomaly_prob = anomaly_prob  # 异常上报概率 (%)
        self.simulation_speed = simulation_speed  # 模拟速度倍率
        
        # 创建车辆状态
        self.vehicle_ids = ["V001", "V002", "V003", "V004", "V005"]
        self.vehicles = {vehicle_id: VehicleState(vehicle_id) for vehicle_id in self.vehicle_ids}
        
        # 创建输出目录
        self._create_directories()
        
        # 计数器
        self.message_count = 0
        self.anomaly_count = 0
        self.batch_id = 0
    
    def _create_directories(self):
        """创建必要的目录结构"""
        # 创建主目录
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
        
        # 创建实时数据目录
        live_dir = os.path.join(self.output_dir, "live")
        if not os.path.exists(live_dir):
            os.makedirs(live_dir)
    
    def safe_write_json(self, file_path, data):
        """安全地写入JSON文件（先写入临时文件，然后重命名）"""
        try:
            # 创建临时文件名
            temp_file = file_path + ".tmp"
            
            # 写入临时文件
            with open(temp_file, 'w') as f:
                json.dump(data, f, indent=2)
                f.flush()  # 确保数据写入磁盘
                os.fsync(f.fileno())  # 强制同步到磁盘
            
            # 重命名临时文件为目标文件（原子操作）
            os.replace(temp_file, file_path)
            return True
        except Exception as e:
            print(f"写入文件 {file_path} 失败: {str(e)}")
            return False
    
    def start(self):
        """启动模拟器"""
        print(f"SAVMS Python 数据模拟器已启动")
        print(f"数据生成间隔: {self.data_rate}ms")
        print(f"模拟速度倍率: {self.simulation_speed}x")
        print(f"车辆数量: {len(self.vehicles)}")
        print(f"输出目录: {self.output_dir}")
        
        last_time = time.time()
        
        try:
            while True:
                # 计算模拟时间流逝
                current_time = time.time()
                elapsed = current_time - last_time
                last_time = current_time
                
                delta_time = elapsed * self.simulation_speed
                
                # 准备批次数据
                telemetry_data = []
                anomaly_data = []
                
                # 实时数据容器
                live_telemetry = {}
                
                # 为每个车辆更新状态并生成数据
                for vehicle_id, vehicle in self.vehicles.items():
                    # 更新车辆状态
                    vehicle.update(delta_time)
                    
                    # 生成并添加遥测数据
                    telemetry = vehicle.generate_telemetry_json()
                    telemetry_data.append(telemetry)
                    live_telemetry[vehicle_id] = telemetry
                    
                    self.message_count += 1
                    
                    # 如果有异常且满足上报概率，生成并添加异常事件
                    if vehicle.has_anomaly and random.randint(1, 100) <= self.anomaly_prob:
                        anomaly = vehicle.generate_anomaly_json()
                        if anomaly:
                            anomaly_data.append(anomaly)
                            
                            print(f"生成异常数据: 车辆={vehicle_id}, 类型={vehicle.anomaly_type}, 严重度={vehicle.anomaly_severity}")
                            
                            self.anomaly_count += 1
                
                # 写入实时数据文件
                live_dir = os.path.join(self.output_dir, "live")
                
                self.safe_write_json(os.path.join(live_dir, "telemetry.json"), {"telemetry": live_telemetry})
                self.safe_write_json(os.path.join(live_dir, "anomaly.json"), anomaly_data)
                
                # 创建批次目录
                batch_dir = os.path.join(self.output_dir, f"batch_{self.batch_id}")
                if not os.path.exists(batch_dir):
                    os.makedirs(batch_dir)
                
                # 先写入标记文件，表示批次开始
                with open(os.path.join(batch_dir, ".batch_start"), 'w') as f:
                    f.write(str(int(time.time())))
                
                # 创建批次数据文件
                telemetry_path = os.path.join(batch_dir, "telemetry.json")
                anomaly_path = os.path.join(batch_dir, "anomaly.json")
                
                # 写入批次数据文件
                self.safe_write_json(telemetry_path, telemetry_data)
                self.safe_write_json(anomaly_path, anomaly_data)
                
                # 写入标记文件，表示批次完成
                with open(os.path.join(batch_dir, ".batch_complete"), 'w') as f:
                    f.write(str(int(time.time())))
                
                # 每10次批次打印一次统计
                if self.batch_id % 10 == 0:
                    print(f"已生成 {self.batch_id} 个批次数据 (遥测: {self.message_count}, 异常: {self.anomaly_count})")
                    
                    # 打印各车辆状态摘要
                    for vehicle_id, vehicle in self.vehicles.items():
                        mode_str = {
                            VehicleMode.IDLE: "空闲",
                            VehicleMode.ACCELERATING: "加速",
                            VehicleMode.CRUISING: "巡航",
                            VehicleMode.DECELERATING: "减速",
                            VehicleMode.CHARGING: "充电"
                        }[vehicle.mode]
                        
                        print(f"车辆 {vehicle_id}: 模式={mode_str}, 速度={vehicle.speed:.1f}km/h, "
                              f"电量={vehicle.battery_soc:.1f}%, 异常={vehicle.anomaly_type if vehicle.has_anomaly else '无'}")
                
                # 更新批次ID
                self.batch_id += 1
                
                # 等待下一个周期
                time.sleep(self.data_rate / 1000)
        
        except KeyboardInterrupt:
            print("\n模拟器已停止")

def main():
    # 解析命令行参数
    parser = argparse.ArgumentParser(description='SAVMS Python 数据模拟器')
    parser.add_argument('--output', type=str, default='savms_data', help='输出目录 (默认: savms_data)')
    parser.add_argument('--rate', type=int, default=1000, help='数据生成间隔(毫秒) (默认: 1000)')
    parser.add_argument('--anomaly-prob', type=int, default=5, help='异常上报概率百分比 (默认: 5)')
    parser.add_argument('--speed', type=int, default=1, help='模拟速度倍率 (默认: 1)')
    
    args = parser.parse_args()
    
    # 创建并启动模拟器
    simulator = VehicleSimulator(
        output_dir=args.output,
        data_rate=args.rate,
        anomaly_prob=args.anomaly_prob,
        simulation_speed=args.speed
    )
    
    simulator.start()

if __name__ == "__main__":
    main()