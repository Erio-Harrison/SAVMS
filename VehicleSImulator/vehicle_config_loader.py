import json
import logging
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from datetime import datetime

@dataclass
class VehicleConfig:
    """车辆配置数据类"""
    id: str
    license_plate: str
    car_model: str
    energy_type: str
    year: int
    dimensions: Dict[str, int]
    equipment: Dict[str, Any]
    initial_position: Dict[str, Any]
    movement_config: Dict[str, Any]
    energy_config: Dict[str, Any]
    sensor_ranges: Dict[str, List[float]]
    driving_behavior: Dict[str, Any]

class VehicleConfigLoader:
    """车辆配置加载器"""
    
    def __init__(self, config_file: str = "vehicle_configs.json"):
        """
        初始化配置加载器
        :param config_file: 配置文件路径
        """
        self.config_file = config_file
        self.logger = logging.getLogger(__name__)
        self._configs: Dict[str, VehicleConfig] = {}
        
    def load_configs(self) -> bool:
        """
        加载车辆配置文件
        :return: 加载是否成功
        """
        try:
            with open(self.config_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            self._configs.clear()
            
            for vehicle_data in data.get('vehicles', []):
                config = VehicleConfig(
                    id=vehicle_data['id'],
                    license_plate=vehicle_data['licensePlate'],
                    car_model=vehicle_data['carModel'],
                    energy_type=vehicle_data['energyType'],
                    year=vehicle_data['year'],
                    dimensions=vehicle_data['dimensions'],
                    equipment=vehicle_data['equipment'],
                    initial_position=vehicle_data['initialPosition'],
                    movement_config=vehicle_data['movementConfig'],
                    energy_config=vehicle_data['energyConfig'],
                    sensor_ranges=vehicle_data['sensorRanges'],
                    driving_behavior=vehicle_data['drivingBehavior']
                )
                
                self._configs[config.id] = config
                self.logger.info(f"加载车辆配置: {config.license_plate} ({config.car_model})")
            
            self.logger.info(f"成功加载 {len(self._configs)} 个车辆配置")
            return True
            
        except FileNotFoundError:
            self.logger.error(f"配置文件未找到: {self.config_file}")
            return False
        except json.JSONDecodeError as e:
            self.logger.error(f"配置文件JSON格式错误: {e}")
            return False
        except Exception as e:
            self.logger.error(f"加载配置文件失败: {e}")
            return False
    
    def get_config(self, vehicle_id: str) -> Optional[VehicleConfig]:
        """
        获取指定车辆的配置
        :param vehicle_id: 车辆ID
        :return: 车辆配置对象，未找到返回None
        """
        return self._configs.get(vehicle_id)
    
    def get_all_configs(self) -> List[VehicleConfig]:
        """
        获取所有车辆配置
        :return: 车辆配置列表
        """
        return list(self._configs.values())
    
    def get_vehicle_ids(self) -> List[str]:
        """
        获取所有车辆ID列表
        :return: 车辆ID列表
        """
        return list(self._configs.keys())
    
    def validate_config(self, config: VehicleConfig) -> List[str]:
        """
        验证车辆配置的有效性
        :param config: 车辆配置
        :return: 错误信息列表，空列表表示配置有效
        """
        errors = []
        
        # 检查必需字段
        if not config.id:
            errors.append("车辆ID不能为空")
        if not config.license_plate:
            errors.append("车牌号不能为空")
        if not config.car_model:
            errors.append("车型不能为空")
        
        # 检查能源配置
        energy = config.energy_config
        if energy['maxEnergy'] <= 0:
            errors.append("最大电量必须大于0")
        if energy['initialEnergy'] > energy['maxEnergy']:
            errors.append("初始电量不能超过最大电量")
        if energy['consumptionRate'] <= 0:
            errors.append("电量消耗率必须大于0")
        if energy['chargingRate'] <= 0:
            errors.append("充电速率必须大于0")
        if not (0 <= energy['autoChargeThreshold'] <= energy['maxEnergy']):
            errors.append("自动充电阈值必须在0到最大电量之间")
        
        # 检查移动配置
        movement = config.movement_config
        if movement['maxSpeed'] <= 0:
            errors.append("最大速度必须大于0")
        if movement['acceleration'] <= 0:
            errors.append("加速度必须大于0")
        if movement['deceleration'] <= 0:
            errors.append("减速度必须大于0")
        if movement['movementRadius'] <= 0:
            errors.append("移动半径必须大于0")
        
        # 检查位置配置
        pos = config.initial_position
        if not (-180 <= pos['longitude'] <= 180):
            errors.append("经度必须在-180到180之间")
        if not (-90 <= pos['latitude'] <= 90):
            errors.append("纬度必须在-90到90之间")
        
        return errors
    
    def create_default_config(self, vehicle_id: str, license_plate: str) -> VehicleConfig:
        """
        创建默认车辆配置
        :param vehicle_id: 车辆ID
        :param license_plate: 车牌号
        :return: 默认配置对象
        """
        return VehicleConfig(
            id=vehicle_id,
            license_plate=license_plate,
            car_model="Default Vehicle",
            energy_type="Electric",
            year=2024,
            dimensions={"length": 4, "width": 2, "height": 1},
            equipment={
                "radarModel": "Standard Radar",
                "radarCount": 4,
                "cameraModel": "Standard Camera",
                "cameraCount": 4
            },
            initial_position={
                "longitude": 116.4074,
                "latitude": 39.9042,
                "description": "默认位置"
            },
            movement_config={
                "maxSpeed": 80,
                "acceleration": 2.5,
                "deceleration": 3.0,
                "movementRadius": 0.005,
                "speedVariation": 10,
                "directionChangeInterval": 60
            },
            energy_config={
                "maxEnergy": 100,
                "initialEnergy": 80,
                "consumptionRate": 1.0,
                "chargingRate": 10.0,
                "autoChargeThreshold": 20,
                "chargingEfficiency": 0.9
            },
            sensor_ranges={
                "engineRPM": [0, 0],
                "lubeOilPressure": [0, 0],
                "fuelPressure": [0, 0],
                "coolantPressure": [15, 35],
                "lubeOilTemp": [20, 50],
                "coolantTemp": [60, 90],
                "engineCondition": [80, 100]
            },
            driving_behavior={
                "aggressiveness": 0.4,
                "preferredSpeed": 50,
                "restProbability": 0.1,
                "restDuration": [10, 30]
            }
        )
    
    def save_config_template(self, filename: str = "vehicle_config_template.json"):
        """
        保存配置模板文件
        :param filename: 模板文件名
        """
        template = {
            "vehicles": [
                {
                    "id": "vehicle_template",
                    "licensePlate": "模板-001",
                    "carModel": "示例车型",
                    "energyType": "Electric",
                    "year": 2024,
                    "dimensions": {
                        "length": 4,
                        "width": 2,
                        "height": 1
                    },
                    "equipment": {
                        "radarModel": "示例雷达",
                        "radarCount": 4,
                        "cameraModel": "示例摄像头",
                        "cameraCount": 4
                    },
                    "initialPosition": {
                        "longitude": 116.4074,
                        "latitude": 39.9042,
                        "description": "初始位置描述"
                    },
                    "movementConfig": {
                        "maxSpeed": 80,
                        "acceleration": 2.5,
                        "deceleration": 3.0,
                        "movementRadius": 0.005,
                        "speedVariation": 10,
                        "directionChangeInterval": 60
                    },
                    "energyConfig": {
                        "maxEnergy": 100,
                        "initialEnergy": 80,
                        "consumptionRate": 1.0,
                        "chargingRate": 10.0,
                        "autoChargeThreshold": 20,
                        "chargingEfficiency": 0.9
                    },
                    "sensorRanges": {
                        "engineRPM": [0, 0],
                        "lubeOilPressure": [0, 0],
                        "fuelPressure": [0, 0],
                        "coolantPressure": [15, 35],
                        "lubeOilTemp": [20, 50],
                        "coolantTemp": [60, 90],
                        "engineCondition": [80, 100]
                    },
                    "drivingBehavior": {
                        "aggressiveness": 0.4,
                        "preferredSpeed": 50,
                        "restProbability": 0.1,
                        "restDuration": [10, 30]
                    }
                }
            ]
        }
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(template, f, indent=2, ensure_ascii=False)
            self.logger.info(f"配置模板已保存到: {filename}")
        except Exception as e:
            self.logger.error(f"保存配置模板失败: {e}")
    
    def print_config_summary(self):
        """打印配置摘要"""
        print("\n车辆配置摘要:")
        print("=" * 80)
        
        for config in self._configs.values():
            print(f"车辆ID: {config.id}")
            print(f"  车牌: {config.license_plate}")
            print(f"  车型: {config.car_model} ({config.year}年)")
            print(f"  能源: {config.energy_type}")
            print(f"  位置: {config.initial_position['description']} "
                  f"({config.initial_position['longitude']:.6f}, "
                  f"{config.initial_position['latitude']:.6f})")
            print(f"  最大速度: {config.movement_config['maxSpeed']} km/h")
            print(f"  电量: {config.energy_config['initialEnergy']}/"
                  f"{config.energy_config['maxEnergy']}%")
            print(f"  充电阈值: {config.energy_config['autoChargeThreshold']}%")
            print("-" * 80) 