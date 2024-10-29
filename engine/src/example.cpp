#include <iostream>
#include <cmath>
#include <chrono>
#include <thread>

class Vehicle {
public:
    Vehicle(double mass, double initial_speed, double brake_force, double wheel_radius)
        : mass(mass), speed(initial_speed), brake_force(brake_force), original_brake_force(brake_force),
          wheel_radius(wheel_radius), wheel_speed(initial_speed / wheel_radius) {}

    // 应用制动力并考虑ABS系统
    void applyBrake(double time_interval) {
        // 计算滑移率
        double slip_ratio = (speed - wheel_speed * wheel_radius) / std::max(speed, 1e-6);

        // 如果滑移率超过0.3，ABS介入，减少制动力
        if (slip_ratio > 0.3) {
            std::cout << "ABS engaged! Reducing brake force." << std::endl;
            brake_force *= 0.5; // ABS减小制动力
        } else {
            // 正常情况恢复制动力
            brake_force = original_brake_force;
        }

        // 计算加速度 a = F_b / m
        double acceleration = brake_force / mass;

        // 更新速度 v(t) = v_0 - a * t
        speed = std::max(0.0, speed - acceleration * time_interval);

        // 更新轮胎的周向速度
        wheel_speed = std::max(0.0, wheel_speed - (acceleration / wheel_radius) * time_interval);

        // 如果车辆速度低于0，设置为0
        if (speed <= 0) {
            speed = 0;
            std::cout << "Vehicle has stopped." << std::endl;
        }
    }

    double getSpeed() const {
        return speed;
    }

private:
    double mass;               // 车辆质量 (kg)
    double speed;              // 车辆速度 (m/s)
    double brake_force;        // 当前制动力 (N)
    double original_brake_force; // 初始制动力 (N)
    double wheel_speed;        // 轮胎的周向速度 (rad/s)
    double wheel_radius;       // 轮胎半径 (m)
};

int main() {
    // 定义车辆初始条件: 质量 1000kg, 初始速度 60m/s, 制动力 5000N, 轮胎半径 0.3m
    Vehicle car(1000, 60, 5000, 0.3);

    auto start_time = std::chrono::high_resolution_clock::now();
    auto last_time = start_time;
    double total_time = 0;

    while (car.getSpeed() > 0) {
        auto current_time = std::chrono::high_resolution_clock::now();
        double time_interval = std::chrono::duration<double>(current_time - last_time).count();
        
        car.applyBrake(time_interval);
        total_time = std::chrono::duration<double>(current_time - start_time).count();
        
        std::cout << "Time: " << total_time << " s, Speed: " << car.getSpeed() << " m/s" << std::endl;
        
        last_time = current_time;

        // 添加一个小的延迟来防止CPU过载
        std::this_thread::sleep_for(std::chrono::milliseconds(10));
    }

    std::cout << "Total stopping time: " << total_time << " seconds." << std::endl;

    return 0;
}