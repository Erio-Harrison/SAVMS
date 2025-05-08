import React, { useState } from 'react';
import {
    Modal,
    SplitButtonGroup,
    Button,
    Dropdown,
    Form,
    Toast,
} from '@douyinfe/semi-ui';
import { IconPlus } from '@douyinfe/semi-icons';
import axiosInstance from '../../axiosInstance';
import VehicleDeleteModal from './VehicleDeleteModal';
import './CarOperationButton.css';
//import './VehicleDeleteModal.css';

export default function CarOperationButton({
                                               vehicles,
                                               onVehicleAdded,
                                               onVehiclesDeleted,
                                               fetchCars
                                           }) {
    const [btnVisible, setBtnVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const menu = [
        {
            node: 'item',
            name: 'Add Vehicle',
            onClick: () => setAddModalVisible(true),
        },
        { node: 'divider' },
        {
            node: 'item',
            name: 'Delete Vehicle',
            type: 'danger',
            onClick: () => setDeleteModalVisible(true),
        },
    ];

    /** Handles the "Add Vehicle" form submission **/
    const handleAddSubmit = async values => {
        const payload = {
            carModel: values.carModel,
            licensePlate: values.licensePlate,
            year: parseInt(values.year, 10),
            energyType: values.energyType,
            length: parseFloat(values.length),
            width: parseFloat(values.width),
            height: parseFloat(values.height),
            radarModel: values.radarModel,
            radarCount: parseInt(values.radarCount, 10),
            cameraModel: values.cameraModel,
            cameraCount: parseInt(values.cameraCount, 10),
        };

        try {
            const res = await axiosInstance.post('/vehicles/create', payload);
            Toast.success('Vehicle added successfully!');
            setAddModalVisible(false);
            onVehicleAdded?.(res.data.data);
        } catch (err) {
            console.error(err);
            Toast.error('Failed to add vehicle');
        }
    };

    /** Sends the delete request for selected plates **/
    const handleDelete = async plates => {
        try {
            await axiosInstance.post('/vehicles/delete', { plates });
            Toast.success(`Deleted ${plates.length} vehicle(s)`);
            setDeleteModalVisible(false);
            onVehiclesDeleted?.(plates);
        } catch (err) {
            console.error(err);
            Toast.error('Delete failed');
        }
    };

    return (
        <>
            <SplitButtonGroup style={{ marginRight: 10 }}>
                <Dropdown
                    onVisibleChange={setBtnVisible}
                    menu={menu}
                    trigger="click"
                    position="bottomRight"
                    contentClassName="custom-dropdown-menu"
                >
                    <Button
                        className="vehicle-action-button"
                        icon={<IconPlus style={{ color: '#000' }} />}
                    />
                </Dropdown>
            </SplitButtonGroup>

            {/* ─── Add Vehicle Modal ────────────────────── */}
            <Modal
                title="New Vehicle"
                visible={addModalVisible}
                onCancel={() => setAddModalVisible(false)}
                centered
                bodyStyle={{ overflow: 'auto', height: 700 }}
                footer={null}
            >
                <Form
                    onSubmit={handleAddSubmit}
                    labelPosition="left"
                    labelAlign="right"
                    labelWidth={120}
                >
                    <Form.Input
                        field="carModel"
                        label="Model"
                        placeholder="e.g. Tesla Model 3"
                        required
                    />
                    <Form.Input
                        field="licensePlate"
                        label="Plate"
                        placeholder="e.g. ABC-123"
                        required
                    />
                    <Form.Input
                        field="year"
                        label="Year"
                        type="number"
                        placeholder="e.g. 2022"
                        required
                    />
                    <Form.Input
                        field="energyType"
                        label="Energy Type"
                        placeholder="e.g. Electric"
                        required
                    />

                    <Form.Input field="length" label="Length" type="number" placeholder="meters" />
                    <Form.Input field="width" label="Width" type="number" placeholder="meters" />
                    <Form.Input field="height" label="Height" type="number" placeholder="meters" />

                    <Form.Input field="radarModel" label="Radar Model" placeholder="RadarX 2000" />
                    <Form.Input field="radarCount" label="Radar Number" type="number" placeholder="e.g. 2" />

                    <Form.Input field="cameraModel" label="Camera Model" placeholder="CamY HD" />
                    <Form.Input field="cameraCount" label="Camera Number" type="number" placeholder="e.g. 4" />

                    <div style={{ textAlign: 'right', marginTop: 24 }}>
                        <Button
                            onClick={() => setAddModalVisible(false)}
                            style={{ marginRight: 12 }}
                        >
                            Cancel
                        </Button>
                        <Button htmlType="submit" theme="solid" type="primary">
                            Submit
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* ─── Delete Vehicle Modal ─────────────────── */}
            <Modal
                title="Delete Vehicle"
                visible={deleteModalVisible}
                width={800}
                footer={null}
                onCancel={() => setDeleteModalVisible(false)}
                centered

            >
                <VehicleDeleteModal
                    vehicles={vehicles}
                    visible={deleteModalVisible}
                    fetchCars={fetchCars}


                    onCancel={() => setDeleteModalVisible(false)}
                    onDelete={handleDelete}
                />
            </Modal>
        </>
    );
}
