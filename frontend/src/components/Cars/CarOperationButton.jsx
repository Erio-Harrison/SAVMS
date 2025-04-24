
import React, { useState } from 'react';
import {Modal, SplitButtonGroup, Button, Dropdown, Form, Toast  } from '@douyinfe/semi-ui';
import { IconTreeTriangleDown } from '@douyinfe/semi-icons';
import axiosInstance from '../../axiosInstance';
export default function CarOperationButton() {
    const [btnVisible, setBtnVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const menu = [
        { node: 'item', name: 'Add Vehicle', onClick: () => handleAddVehicleClick() },
        { node: 'divider' },
        { node: 'item', name: 'Delete Vehicle', type: 'danger' },
    ];

    const handleVisibleChange = (visible) => {
        setBtnVisible(visible);
    };

    const handleAddVehicleClick = () => {
        setModalVisible(true);
    };
    const handleCancel = () => {
        setModalVisible(false);
    };

    const handleSubmit = async (values) => {
        const payload = {
            ...values,
            year: parseInt(values.year),
            length: parseFloat(values.length),
            width: parseFloat(values.width),
            height: parseFloat(values.height),
            radarCount: parseInt(values.radarCount),
            cameraCount: parseInt(values.cameraCount),
        };

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
                title="New Vehicle"
                visible={modalVisible}
                //TODO: implement handle OK
                //onOk={this.handleOk}
                 onCancel={handleCancel}
                centered
                bodyStyle={{ overflow: 'auto', height: 700 }}
                footer={null}
            >

                <Form onSubmit={handleSubmit} labelPosition="left" labelAlign="right" labelWidth={120}>
                    <Form.Input field="carModel" label="Model" placeholder="e.g. Tesla Model 3" required />
                    <Form.Input field="licensePlate" label="Plate" placeholder="e.g. ABC-123" required />
                    <Form.Input field="year" label="Year" type="number" placeholder="e.g. 2022" required />
                    <Form.Input field="energyType" label="Energy Type" placeholder="e.g. Electric" required />

                    <Form.Input field="length" label="Length" type="number" placeholder="meters" />
                    <Form.Input field="width" label="Width" type="number" placeholder="meters" />
                    <Form.Input field="height" label="Height" type="number" placeholder="meters" />

                    <Form.Input field="radarModel" label="Radar Model" placeholder="RadarX 2000" />
                    <Form.Input field="radarCount" label="Radar Number" type="number" placeholder="e.g. 2" />

                    <Form.Input field="cameraModel" label="Camera Model" placeholder="CamY HD" />
                    <Form.Input field="cameraCount" label="Camera Number" type="number" placeholder="e.g. 4" />

                    <div style={{ textAlign: 'right', marginTop: 24 }}>
                        <Button onClick={handleCancel} style={{ marginRight: 12 }}>Cancel</Button>
                        <Button htmlType="submit" theme="solid" type="primary">Submit</Button>
                    </div>
                </Form>
            </Modal>
            </>
    );
}