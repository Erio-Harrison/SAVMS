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
import './operation-modals.css';

export default function CarOperationButton({
                                               vehicles,
                                               onVehicleAdded,
                                               onVehiclesDeleted,
                                               fetchCars
                                           }) {
    const [btnVisible, setBtnVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [addImagesVisible,setAddImagesVisible] = useState(false);

    const [selectedPlate, setSelectedPlate] = useState('');
    const [selectedVehicleId, setSelectedVehicleId] = useState('');
    const [existingImages, setExistingImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadedUrls, setUploadedUrls] = useState([]);


    const menu = [
        {
            node: 'item',
            name: 'Add Vehicle',
            onClick: () => setAddModalVisible(true),
        },
        {
            node: 'item',
            name: 'Add Images',
            onClick: () => setAddImagesVisible(true),
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

    const handleUpload = async () => {
        if (!selectedPlate || selectedFiles.length === 0) {
            Toast.warning('请选择车牌并选择图片');
            return;
        }

        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('photos', file);
        });

        try {
            const res = await axiosInstance.post(`/vehicles/${selectedVehicleId}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            Toast.success('上传成功！');
            setUploadedUrls(res.data.data); // 假设后端返回的 URL 数组
            const newImageUrls = res.data.data || [];

            setExistingImages(prev => [...prev, ...newImageUrls]);

            // 清空选中的文件
            setSelectedFiles([]);


        } catch (err) {
            console.error(err);
            Toast.error('上传失败');
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
                className="car-op-modal"
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

            {/* ─── Add Vehicle Images ─────────────────── */}
            <Modal
                className="car-op-modal"
                title="Add Vehicle Images"
                visible={addImagesVisible}
                width={800}
                footer={null}
                onCancel={() => {
                    setAddImagesVisible(false);
                    setSelectedPlate(null);
                    setExistingImages([]);
                    setSelectedVehicleId(null);
                    setSelectedFiles([]);
                }}
                centered
            >
                <Form labelPosition="top">
                    {/* 选择车牌 */}
                    <Form.Select
                        field="selectedPlate"
                        label="Select Vehicle Plate"
                        placeholder="Select a vehicle"
                        onChange={async (plate) => {
                            setSelectedPlate(plate);
                            // 加载图片（发请求获取该车已有图片）
                            try {
                                const res = await axiosInstance.get(`/vehicles/get/license/${plate}`);
                                const vehicle = res.data;
                                setExistingImages(vehicle.images || []);
                                setSelectedVehicleId(vehicle.id);
                            } catch (err) {
                                console.error(err);
                                setExistingImages([]);
                            }
                        }}
                    >
                        {vehicles.map((v) => (
                            <Form.Select.Option key={v.licensePlate} value={v.licensePlate}>
                                {v.licensePlate}
                            </Form.Select.Option>
                        ))}
                    </Form.Select>

                    {/* 图片预览 */}
                    <div style={{ marginTop: 16 }}>
                        <p>Existing Images:</p>
                        {existingImages.length === 0 ? (
                            <p style={{ color: '#aaa' }}>No images available</p>
                        ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {existingImages.map((url, index) => (
                                    <img key={index} src={url} alt="Vehicle" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }} />
                                ))}
                            </div>
                        )}
                    </div>
                    {/* 上传图片 */}
                    <div style={{ marginBottom: 16, marginTop: 16 }}>
                        <label>Upload Images</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                            style={{ display: 'block', marginTop: 8 }}
                        />
                    </div>

                    {/* 上传按钮 */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 16 }}>
                        <Button onClick={handleUpload} type="primary" theme="solid">
                            Upload Images
                        </Button>
                    </div>

                </Form>


            </Modal>

            {/* ─── Delete Vehicle Modal ─────────────────── */}
            <Modal
                className="car-op-modal"
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
