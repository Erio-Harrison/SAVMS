import { useState, useEffect } from "react";
import axiosInstance from '../axiosInstance';
import { Tag, Table, Typography, Button } from '@douyinfe/semi-ui';

const { Title, Text } = Typography;

export default function VehicleStatusPage() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const columns = [
        {
            title: 'License Plate',
            dataIndex: 'licensePlate',
            key: 'licensePlate',
            width: 120,
            render: (text) => (
                <div className="font-semibold text-blue-600">{text}</div>
            )
        },
        {
            title: 'Model',
            dataIndex: 'carModel',
            key: 'carModel',
            width: 150
        },
        {
            title: 'Speed',
            dataIndex: 'speed',
            key: 'speed',
            width: 100,
            render: (speed) => (
                <span className={`font-medium ${
                    speed > 80 ? 'text-red-500' : 
                    speed > 40 ? 'text-orange-500' : 
                    'text-green-500'
                }`}>
                    {typeof speed === 'number' ? speed.toFixed(2) : '0.00'} km/h
                </span>
            )
        },
        {
            title: 'Energy Level',
            dataIndex: 'leftoverEnergy',
            key: 'leftoverEnergy',
            width: 120,
            render: (energy) => (
                <div className="flex items-center gap-2">
                    <div className="w-16 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-300 ${
                                energy <= 20 ? 'bg-red-500' : 
                                energy <= 50 ? 'bg-orange-500' : 
                                'bg-green-500'
                            }`}
                            style={{ width: `${Math.max(0, Math.min(100, energy || 0))}%` }}
                        />
                    </div>
                    <span className={`text-sm font-medium ${
                        energy <= 20 ? 'text-red-500' : ''
                    }`}>
                        {energy || 0}%
                    </span>
                </div>
            )
        },
        {
            title: 'Location',
            dataIndex: 'Location',
            key: 'Location',
            width: 200,
            render: (location) => location || '-'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => (
                <Tag 
                    size="small" 
                    theme="light" 
                    type={status === 'online' ? 'success' : 'danger'}
                >
                    {status || 'Unknown'}
                </Tag>
            )
        },
        {
            title: 'Last Updated',
            key: 'lastUpdated',
            width: 150,
            render: () => (
                <Text type="tertiary" size="small">
                    Just now
                </Text>
            )
        }
    ];

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("/vehicles/get/all");
            if (response.data && response.data.data) {
                setVehicles(response.data.data);
                setError(null);
            } else {
                setVehicles([]);
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            setError('Failed to fetch vehicle data. Please try again.');
            setVehicles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
        const intervalId = setInterval(fetchVehicles, 30000); // Refresh every 30 seconds
        return () => clearInterval(intervalId);
    }, []);

    const handleRefresh = () => {
        fetchVehicles();
    };

    return (
        <div className="bg-white rounded-3xl p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Title heading={3} className="mb-2">Vehicle Status Monitor</Title>
                    <Text type="tertiary">
                        Real-time monitoring of all vehicles in the system
                    </Text>
                </div>
                <Button 
                    theme="solid" 
                    type="primary"
                    loading={loading}
                    onClick={handleRefresh}
                >
                    Refresh
                </Button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <Text type="danger">{error}</Text>
                </div>
            )}

            <div className="flex-1">
                <Table
                    columns={columns}
                    dataSource={vehicles}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => 
                            `${range[0]}-${range[1]} of ${total} vehicles`
                    }}
                    empty={
                        <div className="text-center py-8">
                            <Text type="tertiary">No vehicles found</Text>
                        </div>
                    }
                    className="h-full"
                />
            </div>

            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                <div>
                    Total Vehicles: <span className="font-medium">{vehicles.length}</span>
                </div>
                <div>
                    Online: <span className="text-green-600 font-medium">
                        {vehicles.filter(v => v.status === 'online').length}
                    </span>
                    {' | '}
                    Offline: <span className="text-red-600 font-medium">
                        {vehicles.filter(v => v.status !== 'online').length}
                    </span>
                </div>
            </div>
        </div>
    );
}