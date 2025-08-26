import threading
import time
import logging
from typing import Optional
from enhanced_vehicle_model import EnhancedVehicleModel
from vehicle_config_loader import VehicleConfig
from database_manager import DatabaseManager
from config import Config

class EnhancedVehicleSimulator:
    """增强版单个车辆模拟器"""
    
    def __init__(self, config: VehicleConfig, db_manager: DatabaseManager):
        """
        初始化车辆模拟器
        :param config: 车辆配置对象
        :param db_manager: 数据库管理器实例
        """
        self.config = config
        self.vehicle_id = config.id
        self.license_plate = config.license_plate
        self.db_manager = db_manager
        self.vehicle_model = EnhancedVehicleModel(config)
        
        # 线程控制
        self.thread = None
        self.running = False
        self.stop_event = threading.Event()
        
        # 日志
        self.logger = logging.getLogger(f"EnhancedVehicleSimulator-{config.license_plate}")
        
        # 数据库中的ObjectId
        self.mongodb_id = None
        
        # 统计信息
        self.update_count = 0
        self.last_status_log_time = time.time()
        
    def initialize_in_database(self) -> bool:
        """
        在数据库中初始化车辆数据
        :return: 初始化是否成功
        """
        try:
            # 检查车辆是否已存在
            existing_vehicle = self.db_manager.find_vehicle_by_license(self.license_plate)
            
            if existing_vehicle:
                self.mongodb_id = str(existing_vehicle["_id"])
                self.vehicle_model.set_object_id(existing_vehicle["_id"])
                self.logger.info(f"车辆 {self.license_plate} 已存在于数据库中，将更新现有记录")
                return True
            else:
                # 创建新车辆记录
                initial_data = self.vehicle_model.generate_dynamic_data()
                self.mongodb_id = self.db_manager.insert_vehicle(initial_data)
                
                if self.mongodb_id:
                    from bson import ObjectId
                    self.vehicle_model.set_object_id(ObjectId(self.mongodb_id))
                    self.logger.info(f"车辆 {self.license_plate} ({self.config.car_model}) 已初始化到数据库")
                    return True
                else:
                    self.logger.error(f"车辆 {self.license_plate} 初始化失败")
                    return False
                    
        except Exception as e:
            self.logger.error(f"车辆 {self.license_plate} 数据库初始化异常: {e}")
            return False
    
    def start_simulation(self):
        """启动车辆模拟"""
        if self.running:
            self.logger.warning(f"车辆 {self.license_plate} 模拟已在运行")
            return
        
        if not self.initialize_in_database():
            self.logger.error(f"车辆 {self.license_plate} 初始化失败，无法启动模拟")
            return
        
        self.running = True
        self.stop_event.clear()
        self.thread = threading.Thread(target=self._simulation_loop, daemon=True)
        self.thread.start()
        self.logger.info(f"车辆 {self.license_plate} 增强模拟已启动")
    
    def stop_simulation(self):
        """停止车辆模拟"""
        if not self.running:
            return
        
        self.running = False
        self.stop_event.set()
        
        if self.thread and self.thread.is_alive():
            self.thread.join(timeout=10)  # 等待最多10秒
        
        self.logger.info(f"车辆 {self.license_plate} 模拟已停止 (总更新次数: {self.update_count})")
    
    def _simulation_loop(self):
        """模拟循环（在独立线程中运行）"""
        self.logger.info(f"车辆 {self.license_plate} 开始增强模拟循环")
        
        while self.running and not self.stop_event.is_set():
            try:
                # 生成新的车辆数据
                vehicle_data = self.vehicle_model.generate_dynamic_data()
                
                # 更新到数据库
                success = self.db_manager.update_vehicle(self.mongodb_id, vehicle_data)
                
                if success:
                    self.update_count += 1
                    
                    # 定期输出详细状态日志
                    current_time = time.time()
                    if current_time - self.last_status_log_time >= 30:  # 每30秒输出一次详细状态
                        self._log_detailed_status(vehicle_data)
                        self.last_status_log_time = current_time
                    else:
                        # 简单的调试信息
                        self.logger.debug(
                            f"车辆 {self.license_plate} - {self.vehicle_model.get_status_summary()} | "
                            f"位置: ({vehicle_data['longitude']:.6f}, {vehicle_data['latitude']:.6f})"
                        )
                else:
                    self.logger.warning(f"车辆 {self.license_plate} 数据更新失败")
                
                # 等待下一次更新
                if not self.stop_event.wait(Config.UPDATE_INTERVAL):
                    continue  # 正常等待结束，继续循环
                else:
                    break  # 收到停止信号
                    
            except Exception as e:
                self.logger.error(f"车辆 {self.license_plate} 模拟循环异常: {e}")
                # 发生异常时等待一段时间再重试
                if not self.stop_event.wait(5):
                    continue
                else:
                    break
        
        self.logger.info(f"车辆 {self.license_plate} 模拟循环结束")
    
    def _log_detailed_status(self, vehicle_data: dict):
        """输出详细状态日志"""
        status_info = [
            f"车辆: {self.license_plate} ({self.config.car_model})",
            f"状态: {self.vehicle_model.get_status_summary()}",
            f"位置: ({vehicle_data['longitude']:.6f}, {vehicle_data['latitude']:.6f})",
            f"方向: {vehicle_data.get('direction', 0):.1f}°",
            f"目标速度: {vehicle_data.get('targetSpeed', 0):.1f} km/h",
            f"更新次数: {self.update_count}"
        ]
        
        self.logger.info(" | ".join(status_info))
    
    def get_status(self) -> dict:
        """
        获取模拟器状态
        :return: 状态信息字典
        """
        status = {
            "vehicle_id": self.vehicle_id,
            "license_plate": self.license_plate,
            "car_model": self.config.car_model,
            "running": self.running,
            "mongodb_id": self.mongodb_id,
            "thread_alive": self.thread.is_alive() if self.thread else False,
            "update_count": self.update_count
        }
        
        # 添加车辆实时状态
        if self.running:
            status.update({
                "current_speed": self.vehicle_model.current_speed,
                "current_energy": self.vehicle_model.current_energy,
                "is_charging": self.vehicle_model.is_charging,
                "is_resting": self.vehicle_model.is_resting,
                "position": {
                    "longitude": self.vehicle_model.current_longitude,
                    "latitude": self.vehicle_model.current_latitude
                },
                "status_summary": self.vehicle_model.get_status_summary()
            })
        
        return status
    
    def get_detailed_info(self) -> dict:
        """获取详细信息"""
        info = {
            "config": {
                "license_plate": self.config.license_plate,
                "car_model": self.config.car_model,
                "energy_type": self.config.energy_type,
                "max_speed": self.config.movement_config['maxSpeed'],
                "max_energy": self.config.energy_config['maxEnergy'],
                "initial_position": self.config.initial_position,
                "movement_radius": self.config.movement_config['movementRadius']
            },
            "current_state": self.get_status(),
            "performance": {
                "update_count": self.update_count,
                "avg_updates_per_minute": self.update_count / max(1, time.time() - self.last_status_log_time) * 60 if self.running else 0
            }
        }
        
        return info
    
    def force_charge(self):
        """强制开始充电"""
        if self.running:
            self.vehicle_model.is_charging = True
            self.vehicle_model.charging_start_time = self.vehicle_model.last_update_time
            self.logger.info(f"车辆 {self.license_plate} 被强制开始充电")
    
    def force_rest(self, duration: float = 60):
        """
        强制休息
        :param duration: 休息时长（秒）
        """
        if self.running:
            self.vehicle_model.is_resting = True
            self.vehicle_model.rest_start_time = self.vehicle_model.last_update_time
            self.vehicle_model.rest_duration = duration
            self.logger.info(f"车辆 {self.license_plate} 被强制休息 {duration} 秒")
    
    def set_target_speed(self, speed: float):
        """
        设置目标速度
        :param speed: 目标速度 km/h
        """
        if self.running:
            self.vehicle_model.set_user_target_speed(speed)
            self.logger.info(f"车辆 {self.license_plate} 用户目标速度设置为 {self.vehicle_model.user_target_speed} km/h")
    
    def __str__(self):
        return f"EnhancedVehicleSimulator({self.license_plate}, {self.config.car_model}, running={self.running})" 