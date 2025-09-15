import { useState, useEffect } from "react";
import { Modal, Select, Button, Toast } from "@douyinfe/semi-ui";
import axiosInstance from "../axiosInstance";

export default function TaskAssignmentModal({ visible, onCancel, task, onAssignSuccess }) {
    const [availableVehicles, setAvailableVehicles] = useState([]);
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            fetchAvailableVehicles();
        }
    }, [visible]);

    const fetchAvailableVehicles = async () => {
        try {
            const response = await axiosInstance.get("/api/tasks/available-vehicles");
            const vehicles = response.data.data || [];
            setAvailableVehicles(vehicles);
        } catch (error) {
            console.error("Error fetching available vehicles:", error);
            Toast.error("Failed to load available vehicles");
        }
    };

    const handleAssign = async () => {
        if (!selectedVehicleId) {
            Toast.warning("Please select a vehicle");
            return;
        }

        setLoading(true);
        try {
            await axiosInstance.post(`/api/tasks/${task.id}/assign/${selectedVehicleId}`);
            Toast.success("Task assigned successfully");
            onAssignSuccess();
            onCancel();
        } catch (error) {
            console.error("Error assigning task:", error);
            Toast.error("Failed to assign task: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const vehicleOptions = availableVehicles.map(vehicle => ({
        value: vehicle.id,
        label: `${vehicle.licensePlate} - ${vehicle.carModel} (${vehicle.energyType})`
    }));

    return (
        <Modal
            title="Assign Task to Vehicle"
            visible={visible}
            onCancel={onCancel}
            footer={
                <div className="flex justify-end gap-2">
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button
                        theme="solid"
                        type="primary"
                        onClick={handleAssign}
                        loading={loading}
                        disabled={!selectedVehicleId}
                    >
                        Assign
                    </Button>
                </div>
            }
        >
            {task && (
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold">Task Details:</h4>
                        <p><strong>Title:</strong> {task.title}</p>
                        <p><strong>Description:</strong> {task.description}</p>
                        <p><strong>Start Location:</strong> {task.startLocation?.address}</p>
                        <p><strong>End Location:</strong> {task.endLocation?.address}</p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">Select Vehicle:</h4>
                        <Select
                            placeholder="Choose an available vehicle"
                            style={{ width: '100%' }}
                            value={selectedVehicleId}
                            onChange={setSelectedVehicleId}
                            optionList={vehicleOptions}
                            emptyContent={<div>No available vehicles</div>}
                        />
                    </div>

                    {availableVehicles.length === 0 && (
                        <div className="text-center text-gray-500 py-4">
                            No vehicles are currently available for assignment
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
}