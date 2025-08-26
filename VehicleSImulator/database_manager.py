import pymongo
from pymongo import MongoClient
from typing import Dict, Any, Optional
import logging
from config import Config

class DatabaseManager:
    """MongoDB数据库管理器"""
    
    def __init__(self):
        """初始化数据库连接"""
        self.client = None
        self.database = None
        self.collection = None
        self.logger = logging.getLogger(__name__)
        
    def connect(self) -> bool:
        """
        连接到MongoDB数据库
        :return: 连接是否成功
        """
        try:
            self.logger.info(f"正在连接到MongoDB: {Config.MONGODB_URI}")
            
            # 创建MongoDB客户端
            self.client = MongoClient(
                Config.MONGODB_URI,
                serverSelectionTimeoutMS=5000,  # 5秒超时
                connectTimeoutMS=5000,
                socketTimeoutMS=5000
            )
            
            # 测试连接
            self.client.server_info()
            
            # 获取数据库和集合
            self.database = self.client[Config.DATABASE_NAME]
            self.collection = self.database[Config.COLLECTION_NAME]
            
            self.logger.info(f"成功连接到数据库: {Config.DATABASE_NAME}.{Config.COLLECTION_NAME}")
            return True
            
        except Exception as e:
            self.logger.error(f"数据库连接失败: {e}")
            return False
    
    def disconnect(self):
        """断开数据库连接"""
        if self.client:
            self.client.close()
            self.logger.info("数据库连接已断开")
    
    def insert_vehicle(self, vehicle_data: Dict[str, Any]) -> Optional[str]:
        """
        插入新的车辆数据
        :param vehicle_data: 车辆数据字典
        :return: 插入的文档ID，失败返回None
        """
        try:
            result = self.collection.insert_one(vehicle_data)
            self.logger.info(f"成功插入车辆数据: {vehicle_data['licensePlate']}")
            return str(result.inserted_id)
        except Exception as e:
            self.logger.error(f"插入车辆数据失败: {e}")
            return None
    
    def update_vehicle(self, vehicle_id: str, vehicle_data: Dict[str, Any]) -> bool:
        """
        更新车辆数据
        :param vehicle_id: 车辆的ObjectId
        :param vehicle_data: 更新的车辆数据
        :return: 更新是否成功
        """
        try:
            from bson import ObjectId
            
            # 移除_id字段，避免更新冲突
            update_data = {k: v for k, v in vehicle_data.items() if k != '_id'}
            
            result = self.collection.update_one(
                {"_id": ObjectId(vehicle_id)},
                {"$set": update_data}
            )
            
            if result.modified_count > 0:
                self.logger.debug(f"成功更新车辆数据: {vehicle_data.get('licensePlate', 'Unknown')}")
                return True
            else:
                self.logger.warning(f"未找到要更新的车辆: {vehicle_id}")
                return False
                
        except Exception as e:
            self.logger.error(f"更新车辆数据失败: {e}")
            return False
    
    def find_vehicle_by_license(self, license_plate: str) -> Optional[Dict[str, Any]]:
        """
        根据车牌号查找车辆
        :param license_plate: 车牌号
        :return: 车辆数据字典，未找到返回None
        """
        try:
            vehicle = self.collection.find_one({"licensePlate": license_plate})
            return vehicle
        except Exception as e:
            self.logger.error(f"查找车辆失败: {e}")
            return None
    
    def get_all_vehicles(self) -> list:
        """
        获取所有车辆数据
        :return: 车辆数据列表
        """
        try:
            vehicles = list(self.collection.find())
            return vehicles
        except Exception as e:
            self.logger.error(f"获取车辆列表失败: {e}")
            return []
    
    def delete_vehicle(self, vehicle_id: str) -> bool:
        """
        删除车辆数据
        :param vehicle_id: 车辆的ObjectId
        :return: 删除是否成功
        """
        try:
            from bson import ObjectId
            result = self.collection.delete_one({"_id": ObjectId(vehicle_id)})
            
            if result.deleted_count > 0:
                self.logger.info(f"成功删除车辆: {vehicle_id}")
                return True
            else:
                self.logger.warning(f"未找到要删除的车辆: {vehicle_id}")
                return False
                
        except Exception as e:
            self.logger.error(f"删除车辆失败: {e}")
            return False
    
    def clear_all_vehicles(self) -> int:
        """
        清空所有车辆数据
        :return: 删除的文档数量
        """
        try:
            result = self.collection.delete_many({})
            self.logger.info(f"清空了 {result.deleted_count} 条车辆记录")
            return result.deleted_count
        except Exception as e:
            self.logger.error(f"清空车辆数据失败: {e}")
            return 0
    
    def get_collection_stats(self) -> Dict[str, Any]:
        """
        获取集合统计信息
        :return: 统计信息字典
        """
        try:
            stats = self.database.command("collStats", Config.COLLECTION_NAME)
            return {
                "document_count": stats.get("count", 0),
                "size": stats.get("size", 0),
                "avg_obj_size": stats.get("avgObjSize", 0)
            }
        except Exception as e:
            self.logger.error(f"获取集合统计失败: {e}")
            return {} 