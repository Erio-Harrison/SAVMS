import logging
import signal
import sys
import time
from typing import List, Dict, Any
from database_manager import DatabaseManager
from enhanced_vehicle_simulator import EnhancedVehicleSimulator
from vehicle_config_loader import VehicleConfigLoader
from config import Config

class EnhancedSimulatorManager:
    """增强版车辆模拟器管理器"""
    
    def __init__(self, config_file: str = "vehicle_configs.json"):
        """初始化模拟器管理器"""
        self.db_manager = DatabaseManager()
        self.config_loader = VehicleConfigLoader(config_file)
        self.simulators: List[EnhancedVehicleSimulator] = []
        self.running = False
        
        # 设置日志
        self.logger = logging.getLogger(__name__)
        
        # 注册信号处理器
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGTERM, self._signal_handler)
    
    def _signal_handler(self, signum, frame):
        """信号处理器，用于优雅关闭"""
        self.logger.info(f"收到信号 {signum}，正在关闭增强模拟器...")
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
        
        # 加载车辆配置
        if not self.config_loader.load_configs():
            self.logger.error("加载车辆配置失败，无法启动模拟器")
            return False
        
        # 验证配置
        if not self._validate_all_configs():
            self.logger.error("车辆配置验证失败，无法启动模拟器")
            return False
        
        # 创建车辆模拟器
        self._create_vehicle_simulators()
        
        self.logger.info(f"增强模拟器管理器初始化完成，共创建 {len(self.simulators)} 个车辆模拟器")
        return True
    
    def _validate_all_configs(self) -> bool:
        """验证所有车辆配置"""
        all_valid = True
        
        for config in self.config_loader.get_all_configs():
            errors = self.config_loader.validate_config(config)
            if errors:
                self.logger.error(f"车辆配置验证失败 {config.license_plate}:")
                for error in errors:
                    self.logger.error(f"  - {error}")
                all_valid = False
        
        return all_valid
    
    def _create_vehicle_simulators(self):
        """创建车辆模拟器实例"""
        configs = self.config_loader.get_all_configs()
        
        if not configs:
            self.logger.warning("未找到车辆配置，将创建默认车辆")
            # 创建默认车辆配置
            for i in range(Config.VEHICLE_COUNT):
                default_config = self.config_loader.create_default_config(
                    vehicle_id=f"vehicle_{i+1:03d}",
                    license_plate=f"默认{i+1:03d}"
                )
                configs.append(default_config)
        
        # 根据Config.VEHICLE_COUNT限制创建的车辆数量
        configs_to_use = configs[:Config.VEHICLE_COUNT]
        
        for config in configs_to_use:
            simulator = EnhancedVehicleSimulator(
                config=config,
                db_manager=self.db_manager
            )
            
            self.simulators.append(simulator)
            self.logger.info(f"创建增强车辆模拟器: {config.license_plate} ({config.car_model})")
    
    def start_all_simulations(self):
        """启动所有车辆模拟"""
        if self.running:
            self.logger.warning("模拟器已在运行")
            return
        
        self.logger.info("启动所有增强车辆模拟...")
        self.running = True
        
        # 启动所有车辆模拟器
        for simulator in self.simulators:
            try:
                simulator.start_simulation()
                time.sleep(0.2)  # 稍微延迟，避免同时启动造成资源竞争
            except Exception as e:
                self.logger.error(f"启动车辆模拟器失败 {simulator.license_plate}: {e}")
        
        self.logger.info(f"已启动 {len(self.simulators)} 个增强车辆模拟器")
    
    def stop_all_simulations(self):
        """停止所有车辆模拟"""
        if not self.running:
            return
        
        self.logger.info("停止所有增强车辆模拟...")
        self.running = False
        
        # 停止所有车辆模拟器
        for simulator in self.simulators:
            try:
                simulator.stop_simulation()
            except Exception as e:
                self.logger.error(f"停止车辆模拟器失败 {simulator.license_plate}: {e}")
        
        # 断开数据库连接
        self.db_manager.disconnect()
        
        self.logger.info("所有增强车辆模拟已停止")
    
    def get_status_report(self) -> Dict[str, Any]:
        """
        获取所有模拟器的状态报告
        :return: 状态报告字典
        """
        report = {
            "manager_running": self.running,
            "total_simulators": len(self.simulators),
            "running_simulators": 0,
            "charging_vehicles": 0,
            "resting_vehicles": 0,
            "moving_vehicles": 0,
            "simulators": []
        }
        
        total_updates = 0
        for simulator in self.simulators:
            status = simulator.get_status()
            report["simulators"].append(status)
            total_updates += status.get("update_count", 0)
            
            if status["running"]:
                report["running_simulators"] += 1
                
                # 统计车辆状态
                if status.get("is_charging", False):
                    report["charging_vehicles"] += 1
                elif status.get("is_resting", False):
                    report["resting_vehicles"] += 1
                elif status.get("current_speed", 0) > 0:
                    report["moving_vehicles"] += 1
        
        report["total_updates"] = total_updates
        
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
        
        print("\n" + "="*80)
        print("增强车辆模拟器状态报告")
        print("="*80)
        print(f"管理器状态: {'运行中' if report['manager_running'] else '已停止'}")
        print(f"总模拟器数: {report['total_simulators']}")
        print(f"运行中模拟器: {report['running_simulators']}")
        print(f"充电中车辆: {report['charging_vehicles']}")
        print(f"休息中车辆: {report['resting_vehicles']}")
        print(f"行驶中车辆: {report['moving_vehicles']}")
        print(f"总更新次数: {report['total_updates']}")
        
        if report.get('database_stats'):
            stats = report['database_stats']
            print(f"数据库记录数: {stats.get('document_count', 'N/A')}")
            print(f"数据库大小: {stats.get('size', 'N/A')} bytes")
        
        print("\n车辆详细状态:")
        print("-" * 80)
        for i, sim_status in enumerate(report['simulators'], 1):
            status_text = sim_status.get('status_summary', '未知状态')
            if not sim_status['running']:
                status_text = "已停止"
            
            car_model = sim_status.get('car_model', 'Unknown')
            update_count = sim_status.get('update_count', 0)
            
            print(f"{i:2d}. {sim_status['license_plate']:12s} ({car_model:15s}) - {status_text:20s} [更新:{update_count:4d}次]")
        
        print("="*80 + "\n")
    
    def print_config_summary(self):
        """打印配置摘要"""
        self.config_loader.print_config_summary()
    
    def get_simulator_by_license(self, license_plate: str) -> EnhancedVehicleSimulator:
        """根据车牌号获取模拟器"""
        for simulator in self.simulators:
            if simulator.license_plate == license_plate:
                return simulator
        return None
    
    def force_vehicle_charge(self, license_plate: str) -> bool:
        """强制指定车辆充电"""
        simulator = self.get_simulator_by_license(license_plate)
        if simulator:
            simulator.force_charge()
            return True
        return False
    
    def force_vehicle_rest(self, license_plate: str, duration: float = 60) -> bool:
        """强制指定车辆休息"""
        simulator = self.get_simulator_by_license(license_plate)
        if simulator:
            simulator.force_rest(duration)
            return True
        return False
    
    def set_vehicle_target_speed(self, license_plate: str, speed: float) -> bool:
        """设置指定车辆的目标速度"""
        simulator = self.get_simulator_by_license(license_plate)
        if simulator:
            simulator.set_target_speed(speed)
            return True
        return False
    
    def run_interactive_mode(self):
        """运行交互模式"""
        print("\n增强车辆模拟器管理系统")
        print("可用命令:")
        print("  start     - 启动所有模拟器")
        print("  stop      - 停止所有模拟器")
        print("  status    - 显示状态报告")
        print("  config    - 显示配置摘要")
        print("  clear     - 清空数据库中的所有车辆数据")
        print("  charge    - 强制指定车辆充电 (格式: charge 车牌号)")
        print("  rest      - 强制指定车辆休息 (格式: rest 车牌号 [时长])")
        print("  speed     - 设置车辆目标速度 (格式: speed 车牌号 速度)")
        print("  quit      - 退出程序")
        print()
        
        while True:
            try:
                command_line = input("请输入命令: ").strip()
                if not command_line:
                    continue
                
                parts = command_line.split()
                command = parts[0].lower()
                
                if command == "start":
                    self.start_all_simulations()
                elif command == "stop":
                    self.stop_all_simulations()
                elif command == "status":
                    self.print_status_report()
                elif command == "config":
                    self.print_config_summary()
                elif command == "clear":
                    confirm = input("确定要清空所有车辆数据吗？(yes/no): ").strip().lower()
                    if confirm == "yes":
                        count = self.db_manager.clear_all_vehicles()
                        print(f"已清空 {count} 条车辆记录")
                    else:
                        print("操作已取消")
                elif command == "charge":
                    if len(parts) >= 2:
                        license_plate = parts[1]
                        if self.force_vehicle_charge(license_plate):
                            print(f"已强制车辆 {license_plate} 开始充电")
                        else:
                            print(f"未找到车辆: {license_plate}")
                    else:
                        print("用法: charge 车牌号")
                elif command == "rest":
                    if len(parts) >= 2:
                        license_plate = parts[1]
                        duration = float(parts[2]) if len(parts) >= 3 else 60
                        if self.force_vehicle_rest(license_plate, duration):
                            print(f"已强制车辆 {license_plate} 休息 {duration} 秒")
                        else:
                            print(f"未找到车辆: {license_plate}")
                    else:
                        print("用法: rest 车牌号 [时长(秒)]")
                elif command == "speed":
                    if len(parts) >= 3:
                        license_plate = parts[1]
                        speed = float(parts[2])
                        if self.set_vehicle_target_speed(license_plate, speed):
                            print(f"已设置车辆 {license_plate} 目标速度为 {speed} km/h")
                        else:
                            print(f"未找到车辆: {license_plate}")
                    else:
                        print("用法: speed 车牌号 速度(km/h)")
                elif command == "quit":
                    self.stop_all_simulations()
                    break
                elif command == "help":
                    print("可用命令: start, stop, status, config, clear, charge, rest, speed, quit")
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
            except ValueError as e:
                print(f"参数错误: {e}")
            except Exception as e:
                self.logger.error(f"交互模式异常: {e}")
    
    def run_continuous_mode(self):
        """运行连续模式（启动后持续运行）"""
        self.start_all_simulations()
        
        try:
            print("增强模拟器已启动，按 Ctrl+C 停止...")
            
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
    
    def reload_configs(self) -> bool:
        """重新加载配置文件"""
        if self.running:
            print("请先停止模拟器再重新加载配置")
            return False
        
        print("重新加载车辆配置...")
        success = self.config_loader.load_configs()
        if success:
            # 重新创建模拟器
            self.simulators.clear()
            self._create_vehicle_simulators()
            print(f"配置重新加载完成，共 {len(self.simulators)} 个车辆")
        
        return success 