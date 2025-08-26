#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
增强车辆模拟器主程序

这个程序使用配置文件系统来管理车辆参数，支持真实的物理模拟：
- 可配置的车辆参数（加速度、初始位置、电量管理等）
- 真实的物理运动模拟
- 智能电量管理和自动充电
- 驾驶行为模拟

使用方法:
1. 设置环境变量或修改 .env 文件中的 MONGODB_URI
2. 编辑 vehicle_configs.json 配置车辆参数
3. 运行: python enhanced_main.py [模式]

作者: AI Assistant
日期: 2024
"""

import os
import sys
import logging
import argparse
from datetime import datetime

# 添加项目根目录到Python路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from enhanced_simulator_manager import EnhancedSimulatorManager
from vehicle_config_loader import VehicleConfigLoader
from config import Config

def setup_logging(level=logging.INFO):
    """设置日志配置"""
    # 创建日志格式
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # 控制台处理器
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    console_handler.setLevel(level)
    
    # 文件处理器
    log_filename = f"enhanced_vehicle_simulator_{datetime.now().strftime('%Y%m%d')}.log"
    file_handler = logging.FileHandler(log_filename, encoding='utf-8')
    file_handler.setFormatter(formatter)
    file_handler.setLevel(logging.DEBUG)
    
    # 配置根日志器
    logging.basicConfig(
        level=logging.DEBUG,
        handlers=[console_handler, file_handler]
    )
    
    # 设置第三方库的日志级别
    logging.getLogger('pymongo').setLevel(logging.WARNING)
    logging.getLogger('urllib3').setLevel(logging.WARNING)

def print_banner():
    """打印程序横幅"""
    banner = """
╔══════════════════════════════════════════════════════════════════════════╗
║                        增强车辆模拟器系统                                  ║
║                     Enhanced Vehicle Simulator                          ║
╠══════════════════════════════════════════════════════════════════════════╣
║  功能: 基于配置文件的真实车辆物理模拟系统                                  ║
║  特性: 配置化参数、真实物理、智能电量管理、驾驶行为模拟                      ║
║  更新频率: 每5秒更新一次车辆数据                                           ║
╚══════════════════════════════════════════════════════════════════════════╝
    """
    print(banner)

def print_configuration():
    """打印配置信息"""
    print("当前配置:")
    print(f"  数据库URI: {Config.MONGODB_URI[:50]}...")
    print(f"  数据库名称: {Config.DATABASE_NAME}")
    print(f"  集合名称: {Config.COLLECTION_NAME}")
    print(f"  更新间隔: {Config.UPDATE_INTERVAL} 秒")
    print(f"  最大车辆数: {Config.VEHICLE_COUNT}")
    print()

def check_config_file():
    """检查配置文件是否存在"""
    config_file = "vehicle_configs.json"
    
    if not os.path.exists(config_file):
        print(f"⚠️  警告: 未找到车辆配置文件 {config_file}")
        
        # 询问是否创建示例配置文件
        response = input("是否创建示例配置文件? (y/n): ").strip().lower()
        if response == 'y':
            loader = VehicleConfigLoader(config_file)
            loader.save_config_template(config_file)
            print(f"✓ 已创建示例配置文件: {config_file}")
            print("请编辑配置文件后重新运行程序")
            return False
        else:
            print("将使用默认配置运行")
    
    return True

def test_database_connection():
    """测试数据库连接"""
    print("测试数据库连接...")
    from database_manager import DatabaseManager
    
    db_manager = DatabaseManager()
    if db_manager.connect():
        print("✓ 数据库连接成功")
        
        # 获取集合统计
        stats = db_manager.get_collection_stats()
        if stats:
            print(f"  当前记录数: {stats.get('document_count', 'N/A')}")
            print(f"  集合大小: {stats.get('size', 'N/A')} bytes")
        
        db_manager.disconnect()
        return True
    else:
        print("✗ 数据库连接失败")
        return False

def run_interactive_mode(config_file: str):
    """运行交互模式"""
    print("启动增强交互模式...")
    
    manager = EnhancedSimulatorManager(config_file)
    if manager.initialize():
        manager.run_interactive_mode()
    else:
        print("增强模拟器初始化失败")
        return 1
    
    return 0

def run_continuous_mode(config_file: str):
    """运行连续模式"""
    print("启动增强连续运行模式...")
    
    manager = EnhancedSimulatorManager(config_file)
    if manager.initialize():
        manager.run_continuous_mode()
    else:
        print("增强模拟器初始化失败")
        return 1
    
    return 0

def run_test_mode(config_file: str):
    """运行测试模式"""
    print("启动增强测试模式...")
    
    # 测试数据库连接
    if not test_database_connection():
        return 1
    
    # 创建一个测试模拟器
    print("\n创建增强测试模拟器...")
    manager = EnhancedSimulatorManager(config_file)
    
    if not manager.initialize():
        print("增强模拟器初始化失败")
        return 1
    
    # 显示配置摘要
    manager.print_config_summary()
    
    # 运行短时间测试
    print("运行60秒增强测试...")
    manager.start_all_simulations()
    
    import time
    for i in range(12):  # 60秒，每5秒一次
        time.sleep(5)
        print(f"测试进度: {(i+1)*5}/60 秒")
        if i == 5:  # 30秒时打印一次状态
            manager.print_status_report()
    
    manager.stop_all_simulations()
    print("增强测试完成")
    return 0

def run_config_mode():
    """运行配置模式 - 创建和管理配置文件"""
    print("配置文件管理模式")
    print("1. 创建示例配置文件")
    print("2. 验证现有配置文件")
    print("3. 显示配置摘要")
    
    choice = input("请选择操作 (1-3): ").strip()
    
    loader = VehicleConfigLoader()
    
    if choice == "1":
        filename = input("配置文件名 (默认: vehicle_configs.json): ").strip()
        if not filename:
            filename = "vehicle_configs.json"
        
        loader.save_config_template(filename)
        print(f"✓ 示例配置文件已创建: {filename}")
        
    elif choice == "2":
        config_file = input("配置文件路径 (默认: vehicle_configs.json): ").strip()
        if not config_file:
            config_file = "vehicle_configs.json"
        
        loader = VehicleConfigLoader(config_file)
        if loader.load_configs():
            print("✓ 配置文件验证通过")
            
            # 验证每个配置
            all_valid = True
            for config in loader.get_all_configs():
                errors = loader.validate_config(config)
                if errors:
                    print(f"✗ 车辆 {config.license_plate} 配置有误:")
                    for error in errors:
                        print(f"    - {error}")
                    all_valid = False
                else:
                    print(f"✓ 车辆 {config.license_plate} 配置正确")
            
            if all_valid:
                print("✓ 所有车辆配置验证通过")
            else:
                print("✗ 部分车辆配置存在问题，请检查修正")
        else:
            print("✗ 配置文件验证失败")
    
    elif choice == "3":
        config_file = input("配置文件路径 (默认: vehicle_configs.json): ").strip()
        if not config_file:
            config_file = "vehicle_configs.json"
        
        loader = VehicleConfigLoader(config_file)
        if loader.load_configs():
            loader.print_config_summary()
        else:
            print("✗ 无法加载配置文件")
    
    else:
        print("无效选择")

def main():
    """主函数"""
    # 解析命令行参数
    parser = argparse.ArgumentParser(description='增强车辆模拟器系统')
    parser.add_argument(
        'mode', 
        nargs='?', 
        choices=['interactive', 'continuous', 'test', 'config'], 
        default='interactive',
        help='运行模式 (默认: interactive)'
    )
    parser.add_argument(
        '--debug', 
        action='store_true', 
        help='启用调试日志'
    )
    parser.add_argument(
        '--config-file', 
        default='vehicle_configs.json',
        help='指定车辆配置文件路径'
    )
    parser.add_argument(
        '--vehicles', 
        type=int, 
        help='指定最大模拟车辆数量'
    )
    
    args = parser.parse_args()
    
    # 设置日志
    log_level = logging.DEBUG if args.debug else logging.INFO
    setup_logging(log_level)
    
    # 如果指定了车辆数量，更新配置
    if args.vehicles:
        Config.VEHICLE_COUNT = args.vehicles
    
    # 打印横幅和配置
    print_banner()
    print_configuration()
    
    # 配置模式不需要检查数据库和配置文件
    if args.mode == 'config':
        return run_config_mode()
    
    # 检查配置文件
    if not check_config_file():
        return 1
    
    # 检查MongoDB URI
    if not Config.MONGODB_URI or Config.MONGODB_URI == 'mongodb://localhost:27017/':
        print("⚠️  警告: 使用默认的MongoDB URI")
        print("   请在 .env 文件中设置 MONGODB_URI 为您的云端MongoDB连接字符串")
        print("   例如: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/")
        print()
        
        response = input("是否继续使用默认配置? (y/n): ").strip().lower()
        if response != 'y':
            print("程序退出")
            return 1
    
    # 根据模式运行
    try:
        if args.mode == 'interactive':
            return run_interactive_mode(args.config_file)
        elif args.mode == 'continuous':
            return run_continuous_mode(args.config_file)
        elif args.mode == 'test':
            return run_test_mode(args.config_file)
    except KeyboardInterrupt:
        print("\n程序被用户中断")
        return 0
    except Exception as e:
        logging.error(f"程序运行异常: {e}")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code) 