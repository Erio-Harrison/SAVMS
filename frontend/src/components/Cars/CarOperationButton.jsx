
import React, { useState } from 'react';
import {Modal, SplitButtonGroup, Button, Dropdown, Form, Toast  } from '@douyinfe/semi-ui';
import { IconTreeTriangleDown } from '@douyinfe/semi-icons';
import axiosInstance from '../../axiosInstance';
export default function CarOperationButton() {
    const [btnVisible, setBtnVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const menu = [
        { node: 'item', name: 'Add Vehicle', onClick: () => handleAddVehicleClick },
        { node: 'divider' },
        { node: 'item', name: 'Delete Vehicle', type: 'danger' },
    ];

    const handleVisibleChange = (visible) => {
        setBtnVisible(visible);
    };

    const handleAddVehicleClick = () => {
        setModalVisible(true);
    };
    
    const handleSubmit = async (values) => {
        try {
            const res = await axiosInstance.post('/vehicles/add', values);
            Toast.success('Vehicle added successfully!');
            setModalVisible(false);
        } catch (error) {
            console.error('Error adding vehicle:', error);
            Toast.error('Failed to add vehicle');
        }
    };


    return (
    <>
        <SplitButtonGroup style={{ marginRight: 10 }} aria-label="项目操作按钮组">
            <Dropdown
                onVisibleChange={handleVisibleChange}
                menu={menu}
                trigger="click"
                position="bottomRight"
            >
                <Button
                    style={btnVisible
                        ? { background: 'var(--semi-color-primary-hover)', padding: '8px 4px' }
                        : { padding: '8px 4px' }}
                    theme="solid"
                    type="primary"
                    icon={<IconTreeTriangleDown />}
                />
            </Dropdown>
        </SplitButtonGroup>

         <Modal
            title="Add New Vehicle"
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
            >
            <Form onSubmit={handleSubmit}>
                <Form.Input field="licensePlate" label="Plate Number" placeholder="e.g. ABC-123" required />
                <Form.Input field="carModel" label="Car Model" placeholder="e.g. Tesla Model 3" required />
                <Form.Input field="speed" label="Speed (km/h)" type="number" required />
                <Form.Input field="leftoverEnergy" label="Energy (%)" type="number" required />
                <Form.Input field="Location" label="Location" placeholder="e.g. ANU Parking Lot" required />
                <Form.Select field="status" label="Status" placeholder="Choose status" required>
                    <Form.Select.Option value="Idle">Idle</Form.Select.Option>
                    <Form.Select.Option value="Running">Running</Form.Select.Option>
                    <Form.Select.Option value="Charging">Charging</Form.Select.Option>
                </Form.Select>

                <div style={{ marginTop: 16, textAlign: 'right' }}>
                    <Button onClick={() => setModalVisible(false)} style={{ marginRight: 12 }}>Cancel</Button>
                    <Button htmlType="submit" theme="solid" type="primary">Submit</Button>
                </div>
            </Form>
        </Modal>
        </>
    );
}