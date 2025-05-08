import React, { useState } from 'react';
import { Transfer, Checkbox, Avatar, Button, Modal, Toast } from '@douyinfe/semi-ui';
import { IconHandle, IconClose } from '@douyinfe/semi-icons';

export default function VehicleDeleteModal({ vehicles, onCancel, onDelete }) {
    const [selectedVehicles, setSelectedVehicles] = useState([]);

    // 渲染源列表项（车辆选择）
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

    // 处理选择车辆
    const handleSelectVehicle = (plate) => {
        setSelectedVehicles((prev) =>
            prev.includes(plate)
                ? prev.filter((p) => p !== plate)
                : [...prev, plate]
        );
    };

    // 确认删除
    const handleConfirmDelete = () => {
        if (selectedVehicles.length === 0) {
            Toast.warning("请先选择要删除的车辆");
            return;
        }
        onDelete(selectedVehicles);
        setSelectedVehicles([]); // 清空选择
    };

    return (
        <Modal
            title="删除车辆"
            visible
            width={600}
            onCancel={onCancel}
            footer={
                <div style={{ textAlign: 'right' }}>
                    <Button onClick={onCancel} style={{ marginRight: 12 }}>
                        取消
                    </Button>
                    <Button
                        type="primary"
                        theme="solid"
                        onClick={handleConfirmDelete}
                        disabled={selectedVehicles.length === 0}
                    >
                        删除 {selectedVehicles.length > 0 ? `(${selectedVehicles.length})` : ""}
                    </Button>
                </div>
            }
        >
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {vehicles.length > 0 ? (
                    vehicles.map((vehicle) => renderSourceItem(vehicle))
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>没有可删除的车辆</div>
                )}
            </div>
        </Modal>
    );
}