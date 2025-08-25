import { useState, useEffect } from "react";
import axios from 'axios';
import { Tag, Table, Typography, Button, LocaleProvider, Toast, Badge } from '@douyinfe/semi-ui';
import { IconAlertTriangle, IconBell } from '@douyinfe/semi-icons';
import en_US from '@douyinfe/semi-ui/lib/es/locale/source/en_US';
import AlertModal from '../components/AlertModal';
import '../styles/AlertStyles.css';

const { Title, Text } = Typography;

export default function VehicleStatusPage() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [alertModalVisible, setAlertModalVisible] = useState(false);
    const [hasNewAlerts, setHasNewAlerts] = useState(false);

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
            title: 'Alert Status',
            key: 'alertStatus',
            width: 120,
            render: (_, vehicle) => {
                const vehicleAlerts = alerts.filter(alert => alert.licensePlate === vehicle.licensePlate);
                const criticalAlerts = vehicleAlerts.filter(alert => alert.severity === 'CRITICAL');
                const highAlerts = vehicleAlerts.filter(alert => alert.severity === 'HIGH');
                
                if (criticalAlerts.length > 0) {
                    return (
                        <Tag size="small" type="danger" className="font-medium">
                            CRITICAL ({criticalAlerts.length})
                        </Tag>
                    );
                }
                if (highAlerts.length > 0) {
                    return (
                        <Tag size="small" type="warning" className="font-medium">
                            HIGH ({highAlerts.length})
                        </Tag>
                    );
                }
                const otherAlerts = vehicleAlerts.filter(alert => alert.severity === 'MEDIUM' || alert.severity === 'LOW');
                if (otherAlerts.length > 0) {
                    return (
                        <Tag size="small" type="secondary" className="font-medium">
                            {otherAlerts[0].severity} ({otherAlerts.length})
                        </Tag>
                    );
                }
                return (
                    <Tag size="small" type="success" className="font-medium">
                        OK
                    </Tag>
                );
            }
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
            const response = await axios.get("http://34.151.113.63:8080/api/vehicle-status/all");
            if (response.data) {
                setVehicles(response.data);
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

    const fetchAlerts = async () => {
        try {
            // Fetch all vehicles first to get their license plates
            const vehiclesResponse = await axios.get("http://34.151.113.63:8080/api/vehicle-status/all");
            const vehiclesList = vehiclesResponse.data || [];
            
            // First, check and generate new alerts for each vehicle
            for (const vehicle of vehiclesList) {
                try {
                    console.log(`Checking alerts for vehicle: ${vehicle.licensePlate} with speed: ${vehicle.speed}`);
                    await axios.post(`http://34.151.113.63:8080/api/alert/${vehicle.licensePlate}/check`);
                } catch (error) {
                    console.error(`Failed to check alerts for vehicle ${vehicle.licensePlate}:`, error);
                }
            }
            
            // Then fetch active alerts for each vehicle
            const allAlerts = [];
            for (const vehicle of vehiclesList) {
                try {
                    const alertsResponse = await axios.get(`http://34.151.113.63:8080/api/alert/${vehicle.licensePlate}/active`);
                    const vehicleAlerts = alertsResponse.data || [];
                    allAlerts.push(...vehicleAlerts);
                } catch (error) {
                    console.error(`Failed to fetch alerts for vehicle ${vehicle.licensePlate}:`, error);
                }
            }
            
            console.log('All active alerts:', allAlerts);
            
            // Check for new critical alerts
            const criticalAlerts = allAlerts.filter(alert => alert.severity === 'CRITICAL');
            const previousCriticalCount = alerts.filter(alert => alert.severity === 'CRITICAL').length;
            
            if (criticalAlerts.length > previousCriticalCount && alerts.length > 0) {
                // New critical alert detected
                setHasNewAlerts(true);
                playAlertSound();
                Toast.error({
                    content: `New critical alert: ${criticalAlerts[criticalAlerts.length - 1]?.description}`,
                    duration: 5,
                    showClose: true
                });
                
                // Auto-show modal for critical alerts
                setAlertModalVisible(true);
            }
            
            setAlerts(allAlerts);
        } catch (error) {
            console.error('Error fetching alerts:', error);
        }
    };

    const playAlertSound = () => {
        // Create audio beep for critical alerts
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    };

    useEffect(() => {
        fetchVehicles();
        fetchAlerts();
        
        const vehicleInterval = setInterval(fetchVehicles, 30000); // Refresh every 30 seconds
        const alertInterval = setInterval(fetchAlerts, 10000); // Check alerts every 10 seconds
        
        return () => {
            clearInterval(vehicleInterval);
            clearInterval(alertInterval);
        };
    }, []);

    // Monitor alerts for changes
    useEffect(() => {
        const criticalAlerts = alerts.filter(alert => alert.severity === 'CRITICAL');
        if (criticalAlerts.length > 0 && !alertModalVisible) {
            setHasNewAlerts(true);
        }
    }, [alerts, alertModalVisible]);

    const handleRefresh = () => {
        fetchVehicles();
        fetchAlerts();
    };

    const handleOpenAlerts = () => {
        setAlertModalVisible(true);
        setHasNewAlerts(false);
    };

    const handleCloseAlerts = () => {
        setAlertModalVisible(false);
        setHasNewAlerts(false);
    };

    const handleResolveAlert = (alertId) => {
        setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    };

    const criticalAlertCount = alerts.filter(alert => alert.severity === 'CRITICAL').length;
    const totalAlertCount = alerts.length;

    // Function to get row class based on alert severity
    const getRowClassName = (record) => {
        const vehicleAlerts = alerts.filter(alert => alert.licensePlate === record.licensePlate);
        const criticalAlerts = vehicleAlerts.filter(alert => alert.severity === 'CRITICAL');
        const highAlerts = vehicleAlerts.filter(alert => alert.severity === 'HIGH');
        
        if (criticalAlerts.length > 0) {
            return 'critical-alert-row';
        }
        if (highAlerts.length > 0) {
            return 'high-alert-row';
        }
        return '';
    };

    return (
        <LocaleProvider locale={en_US}>
            <div className="bg-white rounded-3xl p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Title heading={3} className="mb-2">Vehicle Status Monitor</Title>
                    <Text type="tertiary">
                        Real-time monitoring of all vehicles in the system
                    </Text>
                </div>
                <div className="flex gap-2">
                    {/* Alert Button */}
                    <Badge 
                        count={criticalAlertCount} 
                        overflowCount={99}
                        dot={hasNewAlerts && criticalAlertCount === 0}
                    >
                        <Button
                            theme="solid"
                            type={criticalAlertCount > 0 ? "danger" : "secondary"}
                            icon={<IconAlertTriangle />}
                            onClick={handleOpenAlerts}
                            className={criticalAlertCount > 0 ? "animate-pulse" : ""}
                        >
                            Alerts {totalAlertCount > 0 && `(${totalAlertCount})`}
                        </Button>
                    </Badge>
                    
                    <Button 
                        theme="solid" 
                        type="warning"
                        onClick={fetchAlerts}
                    >
                        Check Alerts
                    </Button>
                    
                    <Button 
                        theme="solid" 
                        type="primary"
                        loading={loading}
                        onClick={handleRefresh}
                    >
                        Refresh
                    </Button>
                </div>
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
                    rowClassName={getRowClassName}
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

            {/* Alert Modal */}
            <AlertModal
                visible={alertModalVisible}
                onClose={handleCloseAlerts}
                onResolve={handleResolveAlert}
            />
        </div>
        </LocaleProvider>
    );
}