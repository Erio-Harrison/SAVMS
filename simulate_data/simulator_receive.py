#!/usr/bin/env python3
import os
import json
import time
import argparse
import datetime
import traceback
from typing import Dict, List, Any
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# 颜色代码，用于终端输出着色
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

class DataReceiver:
    def __init__(self, data_dir="savms_data", verbose=False):
        self.data_dir = data_dir
        self.verbose = verbose
        self.live_dir = os.path.join(self.data_dir, "live")
        
        # 存储最新的遥测数据和异常事件
        self.telemetry_data = {}
        self.anomaly_data = []
        
        # 统计数据
        self.telemetry_count = 0
        self.anomaly_count = 0
        self.last_batch_id = -1
        
        # 待处理的批次队列
        self.pending_batches = set()
        
        # 检查目录是否存在
        if not os.path.exists(self.data_dir):
            print(f"警告: 数据目录 {self.data_dir} 不存在，将在检测到时自动创建")
        
        # 初始化文件系统监视器
        self.event_handler = DataDirHandler(self)
        self.observer = Observer()
    
    def start(self):
        """启动接收器"""
        print(f"{Colors.HEADER}SAVMS Python 数据接收器已启动{Colors.ENDC}")
        print(f"监视目录: {self.data_dir}")
        print(f"详细模式: {'已启用' if self.verbose else '已禁用'}")
        
        # 启动文件系统监视器
        self.observer.schedule(self.event_handler, self.data_dir, recursive=True)
        self.observer.start()
        
        # 第一次加载现有数据
        self.load_live_data()
        
        try:
            while True:
                # 定期加载实时数据
                self.load_live_data()
                
                # 处理待处理的批次
                self.process_pending_batches()
                
                time.sleep(2)  # 每两秒检查一次
        
        except KeyboardInterrupt:
            self.observer.stop()
            print("\n接收器已停止")
        
        self.observer.join()
    
    def add_pending_batch(self, batch_id):
        """添加待处理批次"""
        self.pending_batches.add(batch_id)
    
    def process_pending_batches(self):
        """处理待处理的批次"""
        if not self.pending_batches:
            return
        
        # 复制集合以避免迭代时修改
        batches_to_process = self.pending_batches.copy()
        for batch_id in batches_to_process:
            try:
                self.process_batch(batch_id)
                self.pending_batches.remove(batch_id)
            except Exception as e:
                # 处理失败，保留在待处理队列中
                print(f"{Colors.YELLOW}批次 {batch_id} 处理失败，将在下次重试: {str(e)}{Colors.ENDC}")
    
    def load_live_data(self):
        """加载实时数据"""
        # 确保实时数据目录存在
        if not os.path.exists(self.live_dir):
            return
        
        # 加载遥测数据
        telemetry_path = os.path.join(self.live_dir, "telemetry.json")
        if os.path.exists(telemetry_path):
            try:
                # 尝试安全读取文件
                data = self.safe_read_json(telemetry_path)
                if data and "telemetry" in data:
                    # 更新遥测数据
                    new_data = {}
                    for vehicle_id, telemetry in data["telemetry"].items():
                        # 检查是否为新的或更新的数据
                        if (vehicle_id not in self.telemetry_data or 
                            telemetry["timestamp"] != self.telemetry_data[vehicle_id]["timestamp"]):
                            new_data[vehicle_id] = telemetry
                            self.telemetry_count += 1
                    
                    # 在控制台输出新数据的摘要
                    for vehicle_id, telemetry in new_data.items():
                        self._print_telemetry(telemetry)
                    
                    # 更新存储的数据
                    self.telemetry_data.update(data["telemetry"])
            except Exception as e:
                print(f"{Colors.RED}读取遥测数据失败: {str(e)}{Colors.ENDC}")
        
        # 加载异常数据
        anomaly_path = os.path.join(self.live_dir, "anomaly.json")
        if os.path.exists(anomaly_path) and os.path.getsize(anomaly_path) > 2:  # 检查文件非空
            try:
                # 尝试安全读取文件
                anomalies = self.safe_read_json(anomaly_path)
                if anomalies and isinstance(anomalies, list):
                    # 获取当前异常的时间戳集合
                    current_timestamps = {a["timestamp"] for a in self.anomaly_data}
                    
                    # 过滤出新的异常
                    new_anomalies = [a for a in anomalies if a["timestamp"] not in current_timestamps]
                    
                    if new_anomalies:
                        # 在控制台输出新异常
                        for anomaly in new_anomalies:
                            self._print_anomaly(anomaly)
                            self.anomaly_count += 1
                        
                        # 更新存储的异常数据
                        self.anomaly_data = anomalies
            except Exception as e:
                print(f"{Colors.RED}读取异常数据失败: {str(e)}{Colors.ENDC}")
        
        # 如果为详细模式，打印实时状态
        if self.verbose and (self.telemetry_count > 0 or self.anomaly_count > 0):
            print(f"\n{Colors.CYAN}实时状态:{Colors.ENDC}")
            print(f"已接收 {self.telemetry_count} 条遥测数据，{self.anomaly_count} 条异常事件")
            
            # 显示车辆状态摘要
            for vehicle_id, telemetry in self.telemetry_data.items():
                battery_soc = telemetry["battery"]["soc"]
                battery_temp = telemetry["battery"]["temperature"]
                mode = telemetry["mode"]
                speed = telemetry["sensors"]["gps"]["speed"]
                
                print(f"车辆 {vehicle_id}: 模式={mode}, 速度={speed}km/h, 电池={battery_soc}% ({battery_temp}°C)")
    
    def safe_read_json(self, file_path, max_retries=3, retry_delay=0.5):
        """安全读取JSON文件，处理可能的文件锁定和格式错误"""
        retries = 0
        while retries < max_retries:
            try:
                # 检查文件是否存在且大小大于2字节
                if not os.path.exists(file_path) or os.path.getsize(file_path) <= 2:
                    return None
                
                # 尝试读取文件
                with open(file_path, 'r') as f:
                    return json.load(f)
            except json.JSONDecodeError:
                # 可能是文件正在被写入，等待一段时间再重试
                retries += 1
                if retries < max_retries:
                    time.sleep(retry_delay)
                else:
                    raise
            except Exception:
                # 其他错误，不重试
                raise
        return None
    
    def process_batch(self, batch_id):
        """处理批次数据"""
        if batch_id <= self.last_batch_id:
            return  # 避免重复处理
        
        batch_dir = os.path.join(self.data_dir, f"batch_{batch_id}")
        if not os.path.exists(batch_dir):
            raise FileNotFoundError(f"批次目录 {batch_dir} 不存在")
        
        print(f"{Colors.CYAN}处理批次数据: {batch_dir}{Colors.ENDC}")
        
        # 处理遥测数据
        telemetry_path = os.path.join(batch_dir, "telemetry.json")
        if os.path.exists(telemetry_path):
            try:
                # 尝试安全读取文件
                telemetry_list = self.safe_read_json(telemetry_path)
                if telemetry_list:
                    for telemetry in telemetry_list:
                        vehicle_id = telemetry["vehicle_id"]
                        self.telemetry_data[vehicle_id] = telemetry
                        self.telemetry_count += 1
                        
                        if self.verbose:
                            self._print_telemetry(telemetry)
                    
                    print(f"已处理 {len(telemetry_list)} 条遥测数据")
            except Exception as e:
                print(f"{Colors.RED}处理遥测数据失败: {str(e)}{Colors.ENDC}")
                if self.verbose:
                    traceback.print_exc()
                raise
        
        # 处理异常数据
        anomaly_path = os.path.join(batch_dir, "anomaly.json")
        if os.path.exists(anomaly_path) and os.path.getsize(anomaly_path) > 2:  # 检查文件非空
            try:
                # 尝试安全读取文件
                anomaly_list = self.safe_read_json(anomaly_path)
                if anomaly_list:
                    for anomaly in anomaly_list:
                        self.anomaly_data.append(anomaly)
                        self.anomaly_count += 1
                        
                        # 始终打印异常信息
                        self._print_anomaly(anomaly)
                    
                    print(f"已处理 {len(anomaly_list)} 条异常数据")
            except Exception as e:
                print(f"{Colors.RED}处理异常数据失败: {str(e)}{Colors.ENDC}")
                if self.verbose:
                    traceback.print_exc()
                # 不抛出异常，允许继续处理
        
        self.last_batch_id = batch_id
    
    def _print_telemetry(self, telemetry):
        """打印遥测数据摘要"""
        if not self.verbose:
            return
        
        vehicle_id = telemetry["vehicle_id"]
        timestamp = telemetry["timestamp"]
        mode = telemetry["mode"]
        
        # 转换时间戳为可读格式
        datetime_str = datetime.datetime.fromtimestamp(timestamp/1000).strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]
        
        # 提取关键数据
        battery_soc = telemetry["battery"]["soc"]
        battery_temp = telemetry["battery"]["temperature"]
        motor_temp = telemetry["motor"]["temperature"]
        motor_efficiency = telemetry["motor"]["efficiency"]
        speed = telemetry["sensors"]["gps"]["speed"]
        
        # 根据模式打印不同信息
        mode_info = ""
        if mode == "idle":
            mode_info = "空闲中"
        elif mode == "charging":
            mode_info = f"充电中: {battery_soc}%"
        else:
            mode_info = f"速度: {speed}km/h"
        
        print(f"{Colors.GREEN}遥测 [{vehicle_id}] {datetime_str} 模式: {mode}{Colors.ENDC} | "
              f"{mode_info} | 电池: {battery_soc}% ({battery_temp}°C) | "
              f"电机: {motor_efficiency}% ({motor_temp}°C)")
    
    def _print_anomaly(self, anomaly):
        """打印异常数据信息"""
        vehicle_id = anomaly["vehicle_id"]
        timestamp = anomaly["timestamp"]
        anomaly_type = anomaly["anomaly_type"]
        severity = anomaly["details"]["severity"]
        
        # 转换时间戳为可读格式
        datetime_str = datetime.datetime.fromtimestamp(timestamp/1000).strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]
        
        # 根据异常类型打印不同的详细信息
        details = ""
        if anomaly_type == "battery":
            temp = anomaly["details"]["temperature"]
            voltage_drop = anomaly["details"]["voltage_drop"]
            details = f"电池温度: {temp}°C, 电压下降: {voltage_drop}%"
        elif anomaly_type == "motor":
            temp = anomaly["details"]["temperature"]
            eff_drop = anomaly["details"]["efficiency_drop"]
            vibration = anomaly["details"].get("vibration", "N/A")
            details = f"电机温度: {temp}°C, 效率下降: {eff_drop}%, 振动: {vibration}"
        elif anomaly_type == "communication":
            packet_loss = anomaly["details"]["packet_loss"]
            latency = anomaly["details"]["latency_spike"]
            drops = anomaly["details"]["connection_drops"]
            details = f"丢包率: {packet_loss}%, 延迟: {latency}ms, 连接中断: {drops}次"
        elif anomaly_type == "gps":
            pos_jump = anomaly["details"]["position_jump"]
            signal_loss = "是" if anomaly["details"]["signal_loss"] else "否"
            heading_inc = anomaly["details"]["heading_inconsistency"]
            details = f"位置跳变: {pos_jump}m, 信号丢失: {signal_loss}, 方向不一致: {heading_inc}°"
        
        print(f"{Colors.RED}⚠️ 异常 [{vehicle_id}] {datetime_str} 类型: {anomaly_type} "
              f"严重度: {severity}/3{Colors.ENDC} | {details}")


class DataDirHandler(FileSystemEventHandler):
    """文件系统事件处理器，监视数据目录的变化"""
    def __init__(self, receiver):
        self.receiver = receiver
        self.batch_ready_times = {}  # 记录批次目录创建时间
    
    def on_created(self, event):
        """当创建新文件或目录时调用"""
        # 仅处理目录变化
        if not event.is_directory:
            return
        
        # 检查是否为批次目录
        path = event.src_path
        dir_name = os.path.basename(path)
        
        if dir_name.startswith("batch_"):
            try:
                batch_id = int(dir_name.split("_")[1])
                # 记录目录创建时间，延迟处理
                self.batch_ready_times[batch_id] = time.time()
                # 延迟将批次添加到待处理队列
                time.sleep(0.5)  # 等待半秒钟以确保文件写入完成
                self.receiver.add_pending_batch(batch_id)
            except ValueError:
                pass  # 忽略非法的批次ID


def main():
    # 解析命令行参数
    parser = argparse.ArgumentParser(description='SAVMS Python 数据接收器')
    parser.add_argument('--input', type=str, default='savms_data', help='输入目录 (默认: savms_data)')
    parser.add_argument('--verbose', '-v', action='store_true', help='启用详细输出')
    
    args = parser.parse_args()
    
    # 创建并启动接收器
    receiver = DataReceiver(
        data_dir=args.input,
        verbose=args.verbose
    )
    
    receiver.start()

if __name__ == "__main__":
    main()