#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
车辆模拟器主程序

这个程序用于模拟多辆车的实时数据并更新到MongoDB数据库。
每个车辆在独立的线程中运行，每5秒更新一次数据。

使用方法:
1. 设置环境变量或修改 .env 文件中的 MONGODB_URI
2. 运行: python main.py [模式]
   - interactive: 交互模式（默认）
   - continuous: 连续运行模式
   - test: 测试模式

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

from simulator_manager import SimulatorManager
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
    log_filename = f"vehicle_simulator_{datetime.now().strftime('%Y%m%d')}.log"
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
╔══════════════════════════════════════════════════════════════╗
║                        车辆模拟器系统                          ║
║                     Vehicle Simulator                       ║
╠══════════════════════════════════════════════════════════════╣
║  功能: 模拟多辆车的实时数据并同步到MongoDB数据库                ║
║  特性: 多线程模拟、实时数据更新、MongoDB集成                   ║
║  更新频率: 每5秒更新一次车辆数据                               ║
╚══════════════════════════════════════════════════════════════╝
    """
    print(banner)

def print_configuration():
    """打印配置信息"""
    print("当前配置:")
    print(f"  数据库URI: {Config.MONGODB_URI[:50]}...")
    print(f"  数据库名称: {Config.DATABASE_NAME}")
    print(f"  集合名称: {Config.COLLECTION_NAME}")
    print(f"  更新间隔: {Config.UPDATE_INTERVAL} 秒")
    print(f"  模拟车辆数: {Config.VEHICLE_COUNT}")
    print()

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

def run_interactive_mode():
    """运行交互模式"""
    print("启动交互模式...")
    
    manager = SimulatorManager()
    if manager.initialize():
        manager.run_interactive_mode()
    else:
        print("模拟器初始化失败")
        return 1
    
    return 0

def run_continuous_mode():
    """运行连续模式"""
    print("启动连续运行模式...")
    
    manager = SimulatorManager()
    if manager.initialize():
        manager.run_continuous_mode()
    else:
        print("模拟器初始化失败")
        return 1
    
    return 0

def run_test_mode():
    """运行测试模式"""
    print("启动测试模式...")
    
    # 测试数据库连接
    if not test_database_connection():
        return 1
    
    # 创建一个测试模拟器
    print("\n创建测试模拟器...")
    manager = SimulatorManager()
    
    if not manager.initialize():
        print("模拟器初始化失败")
        return 1
    
    # 运行短时间测试
    print("运行30秒测试...")
    manager.start_all_simulations()
    
    import time
    for i in range(6):  # 30秒，每5秒一次
        time.sleep(5)
        print(f"测试进度: {(i+1)*5}/30 秒")
        if i == 2:  # 15秒时打印一次状态
            manager.print_status_report()
    
    manager.stop_all_simulations()
    print("测试完成")
    return 0

def main():
    """主函数"""
    # 解析命令行参数
    parser = argparse.ArgumentParser(description='车辆模拟器系统')
    parser.add_argument(
        'mode', 
        nargs='?', 
        choices=['interactive', 'continuous', 'test'], 
        default='interactive',
        help='运行模式 (默认: interactive)'
    )
    parser.add_argument(
        '--debug', 
        action='store_true', 
        help='启用调试日志'
    )
    parser.add_argument(
        '--vehicles', 
        type=int, 
        help='指定模拟车辆数量'
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
            return run_interactive_mode()
        elif args.mode == 'continuous':
            return run_continuous_mode()
        elif args.mode == 'test':
            return run_test_mode()
    except KeyboardInterrupt:
        print("\n程序被用户中断")
        return 0
    except Exception as e:
        logging.error(f"程序运行异常: {e}")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code) 