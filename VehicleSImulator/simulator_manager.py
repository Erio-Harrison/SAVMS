import logging
import signal
import sys
import time
from typing import List, Dict, Any
from database_manager import DatabaseManager
from vehicle_simulator import VehicleSimulator
from config import Config

class SimulatorManager:
    """车辆模拟器管理器"""
    
    def __init__(self):
        """初始化模拟器管理器"""
        self.db_manager = DatabaseManager()
        self.simulators: List[VehicleSimulator] = []
        self.running = False
        
        # 设置日志
        self.logger = logging.getLogger(__name__)
        
        # 注册信号处理器
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGTERM, self._signal_handler)
    
    def _signal_handler(self, signum, frame):
        """信号处理器，用于优雅关闭"""
        self.logger.info(f"收到信号 {signum}，正在关闭模拟器...")
        self.stop_all_simulations()
        sys.exit(0)
    
    def initialize(self) -> bool:
        """
        初始化模拟器管理器
        :return: 初始化是否成功
        """
        # 连接数据库
        if not self.db_manager.connect():
            self.logger.error("数据库连接失败，无法启动模拟器")
            return False
        
        # 创建车辆模拟器
        self._create_vehicle_simulators()
        
        self.logger.info(f"模拟器管理器初始化完成，共创建 {len(self.simulators)} 个车辆模拟器")
        return True
    
    def _create_vehicle_simulators(self):
        """创建车辆模拟器实例"""
        # 预定义的车辆信息
        vehicles_info = [
            {"id": "vehicle_001", "license": "ABC-123"},
            {"id": "vehicle_002", "license": "DEF-456"},
            {"id": "vehicle_003", "license": "GHI-789"},
            {"id": "vehicle_004", "license": "JKL-012"},
            {"id": "vehicle_005", "license": "MNO-345"},
            {"id": "vehicle_006", "license": "PQR-678"},
            {"id": "vehicle_007", "license": "STU-901"},
            {"id": "vehicle_008", "license": "VWX-234"},
            {"id": "vehicle_009", "license": "YZA-567"},
            {"id": "vehicle_010", "license": "BCD-890"}
        ]
        
        # 根据配置创建指定数量的车辆
        for i in range(Config.VEHICLE_COUNT):
            if i < len(vehicles_info):
                vehicle_info = vehicles_info[i]
            else:
                # 如果预定义的车辆不够，自动生成
                vehicle_info = {
                    "id": f"vehicle_{i+1:03d}",
                    "license": f"模拟{i+1:03d}"
                }
            
            simulator = VehicleSimulator(
                vehicle_id=vehicle_info["id"],
                license_plate=vehicle_info["license"],
                db_manager=self.db_manager
            )
            
            self.simulators.append(simulator)
            self.logger.info(f"创建车辆模拟器: {vehicle_info['license']}")
    
    def start_all_simulations(self):
        """启动所有车辆模拟"""
        if self.running:
            self.logger.warning("模拟器已在运行")
            return
        
        self.logger.info("启动所有车辆模拟...")
        self.running = True
        
        # 启动所有车辆模拟器
        for simulator in self.simulators:
            try:
                simulator.start_simulation()
                time.sleep(0.1)  # 稍微延迟，避免同时启动造成资源竞争
            except Exception as e:
                self.logger.error(f"启动车辆模拟器失败 {simulator.license_plate}: {e}")
        
        self.logger.info(f"已启动 {len(self.simulators)} 个车辆模拟器")
    
    def stop_all_simulations(self):
        """停止所有车辆模拟"""
        if not self.running:
            return
        
        self.logger.info("停止所有车辆模拟...")
        self.running = False
        
        # 停止所有车辆模拟器
        for simulator in self.simulators:
            try:
                simulator.stop_simulation()
            except Exception as e:
                self.logger.error(f"停止车辆模拟器失败 {simulator.license_plate}: {e}")
        
        # 断开数据库连接
        self.db_manager.disconnect()
        
        self.logger.info("所有车辆模拟已停止")
    
    def get_status_report(self) -> Dict[str, Any]:
        """
        获取所有模拟器的状态报告
        :return: 状态报告字典
        """
        report = {
            "manager_running": self.running,
            "total_simulators": len(self.simulators),
            "running_simulators": 0,
            "simulators": []
        }
        
        for simulator in self.simulators:
            status = simulator.get_status()
            report["simulators"].append(status)
            
            if status["running"]:
                report["running_simulators"] += 1
        
        # 添加数据库统计
        try:
            db_stats = self.db_manager.get_collection_stats()
            report["database_stats"] = db_stats
        except Exception as e:
            self.logger.warning(f"获取数据库统计失败: {e}")
            report["database_stats"] = {}
        
        return report
    
    def print_status_report(self):
        """打印状态报告"""
        report = self.get_status_report()
        
        print("\n" + "="*60)
        print("车辆模拟器状态报告")
        print("="*60)
        print(f"管理器状态: {'运行中' if report['manager_running'] else '已停止'}")
        print(f"总模拟器数: {report['total_simulators']}")
        print(f"运行中模拟器: {report['running_simulators']}")
        
        if report.get('database_stats'):
            stats = report['database_stats']
            print(f"数据库记录数: {stats.get('document_count', 'N/A')}")
            print(f"数据库大小: {stats.get('size', 'N/A')} bytes")
        
        print("\n车辆详细状态:")
        print("-" * 60)
        for i, sim_status in enumerate(report['simulators'], 1):
            status_text = "运行中" if sim_status['running'] else "已停止"
            print(f"{i:2d}. {sim_status['license_plate']:10s} - {status_text}")
        
        print("="*60 + "\n")
    
    def run_interactive_mode(self):
        """运行交互模式"""
        print("\n车辆模拟器管理系统")
        print("可用命令:")
        print("  start  - 启动所有模拟器")
        print("  stop   - 停止所有模拟器")
        print("  status - 显示状态报告")
        print("  clear  - 清空数据库中的所有车辆数据")
        print("  quit   - 退出程序")
        print()
        
        while True:
            try:
                command = input("请输入命令: ").strip().lower()
                
                if command == "start":
                    self.start_all_simulations()
                elif command == "stop":
                    self.stop_all_simulations()
                elif command == "status":
                    self.print_status_report()
                elif command == "clear":
                    confirm = input("确定要清空所有车辆数据吗？(yes/no): ").strip().lower()
                    if confirm == "yes":
                        count = self.db_manager.clear_all_vehicles()
                        print(f"已清空 {count} 条车辆记录")
                    else:
                        print("操作已取消")
                elif command == "quit":
                    self.stop_all_simulations()
                    break
                elif command == "help":
                    print("可用命令: start, stop, status, clear, quit")
                else:
                    print(f"未知命令: {command}，输入 help 查看可用命令")
                    
            except KeyboardInterrupt:
                print("\n\n收到中断信号，正在退出...")
                self.stop_all_simulations()
                break
            except EOFError:
                print("\n\n程序结束")
                self.stop_all_simulations()
                break
            except Exception as e:
                self.logger.error(f"交互模式异常: {e}")
    
    def run_continuous_mode(self):
        """运行连续模式（启动后持续运行）"""
        self.start_all_simulations()
        
        try:
            print("模拟器已启动，按 Ctrl+C 停止...")
            
            # 定期打印状态报告
            status_interval = 60  # 每60秒打印一次状态
            last_status_time = time.time()
            
            while self.running:
                time.sleep(5)
                
                # 定期打印状态
                current_time = time.time()
                if current_time - last_status_time >= status_interval:
                    self.print_status_report()
                    last_status_time = current_time
                    
        except KeyboardInterrupt:
            print("\n收到中断信号，正在停止模拟器...")
        finally:
            self.stop_all_simulations() 