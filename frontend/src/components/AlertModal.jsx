import React, { useState, useEffect } from 'react';
import { Modal, Button, Typography, Tag, Divider, List, Avatar } from '@douyinfe/semi-ui';
import { IconAlertTriangle, IconClose, IconTick } from '@douyinfe/semi-icons';
import axios from 'axios';

const { Title, Text } = Typography;

export default function AlertModal({ visible, onClose, onResolve }) {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            fetchActiveAlerts();
        }
    }, [visible]);

    const fetchActiveAlerts = async () => {
        try {
            setLoading(true);
            // Since your AlertController doesn't have a "get all alerts" endpoint,
            // we'll need to fetch active alerts for each vehicle
            // First, get all vehicles to get their license plates
            const vehiclesResponse = await axios.get('http://34.151.113.63:8080/api/vehicle-status/all');
            const vehicles = vehiclesResponse.data || [];
            
            // Then fetch active alerts for each vehicle
            const allAlerts = [];
            for (const vehicle of vehicles) {
                try {
                    const alertsResponse = await axios.get(`http://34.151.113.63:8080/api/alert/${vehicle.licensePlate}/active`);
                    const vehicleAlerts = alertsResponse.data || [];
                    allAlerts.push(...vehicleAlerts);
                } catch (error) {
                    console.error(`Failed to fetch alerts for vehicle ${vehicle.licensePlate}:`, error);
                }
            }
            
            setAlerts(allAlerts);
        } catch (error) {
            console.error('Failed to fetch alerts:', error);
            setAlerts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleResolveAlert = async (alertId) => {
        try {
            await axios.put(`http://34.151.113.63:8080/api/alert/${alertId}/resolve`);
            setAlerts(prev => prev.filter(alert => alert.id === alertId ? {...alert, status: 'RESOLVED'} : alert));
            onResolve && onResolve(alertId);
            
            // Refresh the alerts list to get updated data
            fetchActiveAlerts();
        } catch (error) {
            console.error('Failed to resolve alert:', error);
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'CRITICAL':
                return 'danger';
            case 'HIGH':
                return 'warning';
            case 'MEDIUM':
                return 'secondary';
            default:
                return 'tertiary';
        }
    };

    const getAlertIcon = (alertType) => {
        switch (alertType) {
            case 'LOW_ENERGY':
                return '🔋';
            case 'SPEED_OVER_LIMIT':
                return '⚡';
            case 'CONNECTION_LOST':
                return '📶';
            case 'ENGINE_ISSUE':
                return '🔧';
            case 'OIL_TEMP_HIGH':
                return '🌡️';
            case 'COOLANT_TEMP_HIGH':
                return '🌡️';
            case 'OIL_PRESSURE_LOW':
                return '🛢️';
            case 'FUEL_PRESSURE_LOW':
                return '⛽';
            default:
                return '⚠️';
        }
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'Unknown';
        // Your backend uses LocalDateTime, so it should be in ISO format
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const criticalAlerts = alerts.filter(alert => alert.severity === 'CRITICAL');
    const otherAlerts = alerts.filter(alert => alert.severity !== 'CRITICAL');

    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <IconAlertTriangle className="text-red-500" />
                    <span>Critical System Alerts</span>
                    {alerts.length > 0 && (
                        <Tag size="small" type="danger">
                            {alerts.length} Active
                        </Tag>
                    )}
                </div>
            }
            visible={visible}
            onCancel={onClose}
            width={800}
            footer={
                <div className="flex justify-between">
                    <Button onClick={fetchActiveAlerts} loading={loading}>
                        Refresh Alerts
                    </Button>
                    <Button type="primary" onClick={onClose}>
                        Close
                    </Button>
                </div>
            }
            maskClosable={false}
            closable={true}
            className="alert-modal"
        >
            <div className="max-h-96 overflow-y-auto">
                {loading ? (
                    <div className="text-center py-8">
                        <Text>Loading alerts...</Text>
                    </div>
                ) : alerts.length === 0 ? (
                    <div className="text-center py-8">
                        <IconTick className="text-green-500 text-4xl mb-2" />
                        <Title heading={4} className="text-green-600">All Clear</Title>
                        <Text type="tertiary">No active alerts in the system</Text>
                    </div>
                ) : (
                    <>
                        {/* Critical Alerts Section */}
                        {criticalAlerts.length > 0 && (
                            <>
                                <div className="mb-4">
                                    <Title heading={5} className="text-red-600 mb-3 flex items-center gap-2">
                                        🚨 Critical Alerts ({criticalAlerts.length})
                                    </Title>
                                    <List
                                        dataSource={criticalAlerts}
                                        renderItem={(alert, index) => (
                                            <List.Item
                                                key={alert.id}
                                                className="border-l-4 border-red-500 bg-red-50 mb-2 p-3 rounded"
                                            >
                                                <div className="flex justify-between items-start w-full">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-2xl">
                                                                {getAlertIcon(alert.alertType)}
                                                            </span>
                                                            <Text strong className="text-red-700">
                                                                {alert.licensePlate}
                                                            </Text>
                                                            <Tag size="small" type={getSeverityColor(alert.severity)}>
                                                                {alert.severity}
                                                            </Tag>
                                                        </div>
                                                        <Text className="text-red-800 font-medium block mb-1">
                                                            {alert.description}
                                                        </Text>
                                                        <Text type="tertiary" size="small">
                                                            {formatTimestamp(alert.timestamp)}
                                                        </Text>
                                                    </div>
                                                    <Button
                                                        size="small"
                                                        type="danger"
                                                        theme="outline"
                                                        icon={<IconTick />}
                                                        onClick={() => handleResolveAlert(alert.id)}
                                                    >
                                                        Resolve
                                                    </Button>
                                                </div>
                                            </List.Item>
                                        )}
                                    />
                                </div>
                                {otherAlerts.length > 0 && <Divider />}
                            </>
                        )}

                        {/* Other Alerts Section */}
                        {otherAlerts.length > 0 && (
                            <div>
                                <Title heading={5} className="text-orange-600 mb-3 flex items-center gap-2">
                                    ⚠️ Other Alerts ({otherAlerts.length})
                                </Title>
                                <List
                                    dataSource={otherAlerts}
                                    renderItem={(alert, index) => (
                                        <List.Item
                                            key={alert.id}
                                            className="border-l-4 border-orange-400 bg-orange-50 mb-2 p-3 rounded"
                                        >
                                            <div className="flex justify-between items-start w-full">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-2xl">
                                                            {getAlertIcon(alert.alertType)}
                                                        </span>
                                                        <Text strong className="text-orange-700">
                                                            {alert.licensePlate}
                                                        </Text>
                                                        <Tag size="small" type={getSeverityColor(alert.severity)}>
                                                            {alert.severity}
                                                        </Tag>
                                                    </div>
                                                    <Text className="text-orange-800 block mb-1">
                                                        {alert.description}
                                                    </Text>
                                                    <Text type="tertiary" size="small">
                                                        {formatTimestamp(alert.timestamp)}
                                                    </Text>
                                                </div>
                                                <Button
                                                    size="small"
                                                    type="warning"
                                                    theme="outline"
                                                    icon={<IconTick />}
                                                    onClick={() => handleResolveAlert(alert.id)}
                                                >
                                                    Resolve
                                                </Button>
                                            </div>
                                        </List.Item>
                                    )}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </Modal>
    );
}