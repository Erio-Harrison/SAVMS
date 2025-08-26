import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

class Config:
    # MongoDB配置
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
    DATABASE_NAME = os.getenv('DATABASE_NAME', '123')
    COLLECTION_NAME = os.getenv('COLLECTION_NAME', 'vehicle')
    
    # 模拟器配置
    UPDATE_INTERVAL = 5  # 更新间隔（秒）
    VEHICLE_COUNT = 6    # 模拟车辆数量
    
    # 车辆模拟范围配置
    SPEED_RANGE = (0, 200)          # 速度范围 km/h
    LOCATION_RANGE = {              # 位置范围（示例：北京地区）
        'longitude': (116.3, 116.5),
        'latitude': (39.9, 40.1)
    }
    
    # 传感器数据范围
    SENSOR_RANGES = {
        'leftoverEnergy': (0, 100),
        'engineRPM': (0, 8000),
        'lubeOilPressure': (0, 100),
        'fuelPressure': (0, 100),
        'coolantPressure': (0, 100),
        'lubeOilTemp': (-40, 150),
        'coolantTemp': (-40, 120),
        'engineCondition': (0, 100)
    } 