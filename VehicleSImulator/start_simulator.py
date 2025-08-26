#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
车辆模拟器快速启动脚本
"""

import os

def main():
    print("车辆模拟器快速启动")
    print("=" * 50)
    
    # 检查环境变量文件
    if not os.path.exists('.env'):
        print("⚠️  未找到 .env 文件")
        print("请按照以下步骤配置:")
        print("1. 复制 .env.example 为 .env")
        print("2. 编辑 .env 文件，填入您的MongoDB连接信息")
        print("3. 重新运行此脚本")
        return
    
    # 提示用户选择模式
    print("请选择运行模式:")
    print("1. 交互模式 (推荐)")
    print("2. 连续运行模式")
    print("3. 测试模式")
    
    try:
        choice = input("请输入选择 (1-3): ").strip()
        
        if choice == "1":
            os.system("python main.py interactive")
        elif choice == "2":
            os.system("python main.py continuous")
        elif choice == "3":
            os.system("python main.py test")
        else:
            print("无效选择，使用默认交互模式")
            os.system("python main.py interactive")
            
    except KeyboardInterrupt:
        print("\n程序被用户中断")
    except Exception as e:
        print(f"启动失败: {e}")

if __name__ == "__main__":
    main() 