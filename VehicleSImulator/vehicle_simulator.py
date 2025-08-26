import threading
import time
import logging
from typing import Optional
from vehicle_model import VehicleModel
from database_manager import DatabaseManager
from config import Config

class VehicleSimulator:
    """单个车辆模拟器"""
    
    def __init__(self, vehicle_id: str, license_plate: str, db_manager: DatabaseManager):
        """
        初始化车辆模拟器
        :param vehicle_id: 车辆ID
        :param license_plate: 车牌号
        :param db_manager: 数据库管理器实例
        """
        self.vehicle_id = vehicle_id
        self.license_plate = license_plate
        self.db_manager = db_manager
        self.vehicle_model = VehicleModel(vehicle_id, license_plate)
        
        # 线程控制
        self.thread = None
        self.running = False
        self.stop_event = threading.Event()
        
        # 日志
        self.logger = logging.getLogger(f"VehicleSimulator-{license_plate}")
        
        # 数据库中的ObjectId
        self.mongodb_id = None
        
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
                    self.logger.info(f"车辆 {self.license_plate} 已初始化到数据库")
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
        self.logger.info(f"车辆 {self.license_plate} 模拟已启动")
    
    def stop_simulation(self):
        """停止车辆模拟"""
        if not self.running:
            return
        
        self.running = False
        self.stop_event.set()
        
        if self.thread and self.thread.is_alive():
            self.thread.join(timeout=10)  # 等待最多10秒
        
        self.logger.info(f"车辆 {self.license_plate} 模拟已停止")
    
    def _simulation_loop(self):
        """模拟循环（在独立线程中运行）"""
        self.logger.info(f"车辆 {self.license_plate} 开始模拟循环")
        
        while self.running and not self.stop_event.is_set():
            try:
                # 生成新的车辆数据
                vehicle_data = self.vehicle_model.generate_dynamic_data()
                
                # 更新到数据库
                success = self.db_manager.update_vehicle(self.mongodb_id, vehicle_data)
                
                if success:
                    self.logger.debug(f"车辆 {self.license_plate} 数据已更新 - 速度: {vehicle_data['speed']} km/h, "
                                    f"位置: ({vehicle_data['longitude']:.6f}, {vehicle_data['latitude']:.6f})")
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
    
    def get_status(self) -> dict:
        """
        获取模拟器状态
        :return: 状态信息字典
        """
        return {
            "vehicle_id": self.vehicle_id,
            "license_plate": self.license_plate,
            "running": self.running,
            "mongodb_id": self.mongodb_id,
            "thread_alive": self.thread.is_alive() if self.thread else False
        }
    
    def __str__(self):
        return f"VehicleSimulator({self.license_plate}, running={self.running})" 