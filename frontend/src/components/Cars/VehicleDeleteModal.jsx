import React, { useState, useEffect } from 'react';
import { Checkbox, Avatar, Button, Toast } from '@douyinfe/semi-ui';
import { IconHandle, IconClose } from '@douyinfe/semi-icons';
import axiosInstance from '../../axiosInstance';

export default function VehicleDeleteModal({ vehicles, onCancel, onDelete, fetchCars }) {
    const [selectedVehicles, setSelectedVehicles] = useState([]);

    useEffect(() => {
        if (fetchCars) {
            fetchCars(); // Ensure the function is executed correctly
        }
    }, [fetchCars]);

    // 渲染单个车辆项
    const renderSourceItem = (item) => (
        <div className="components-transfer-demo-source-item" key={item.licensePlate}>
            <Checkbox
                onChange={() => handleSelectVehicle(item.licensePlate)}
                checked={selectedVehicles.includes(item.licensePlate)}
                style={{ height: 52, alignItems: 'center' }}
            >
                <Avatar color="blue" size="small">
                    {item.licensePlate[0]}
                </Avatar>
                <div className="info">
                    <div className="name">{item.carModel}</div>
                    <div className="plate">{item.licensePlate}</div>
                </div>
            </Checkbox>
        </div>
    );

    // 选择/取消选择车辆
    const handleSelectVehicle = (plate) => {
        setSelectedVehicles((prev) =>
            prev.includes(plate) ? prev.filter((p) => p !== plate) : [...prev, plate]
        );
    };

    // 确认删除操作
    const handleConfirmDelete = async () => {
        if (selectedVehicles.length === 0) {
            Toast.warning('请先选择要删除的车辆');
            return;
        }

        try {
            const res = await axiosInstance.delete('/vehicles/delete/byPlate', {
                data: selectedVehicles
            });
            Toast.success(res.data.msg);
            setSelectedVehicles([]);
            //fetchCars(); // 更新车辆
        } catch (error) {
            console.error(error);
            Toast.error('删除车辆失败，请重试');
        }
    };

    return (
        <>
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {vehicles && vehicles.length > 0 ? (
                    vehicles.map((vehicle) => renderSourceItem(vehicle))
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>没有可删除的车辆</div>
                )}
            </div>
            <div style={{ textAlign: 'right', marginTop: 12 }}>
                <Button onClick={onCancel} style={{ marginRight: 12 }}>
                    取消
                </Button>
                <Button
                    type="primary"
                    theme="solid"
                    onClick={handleConfirmDelete}
                    disabled={selectedVehicles.length === 0}
                >
                    删除 {selectedVehicles.length > 0 ? `(${selectedVehicles.length})` : ''}
                </Button>
            </div>
        </>
    );
}
