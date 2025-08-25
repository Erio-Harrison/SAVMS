# Alert System - User Guide

## Overview
The SAVMS Alert System provides real-time monitoring and management of vehicle alerts with a comprehensive modal interface for viewing and resolving system alerts.

## Features

### Alert Modal Component (`AlertModal.jsx`)
- **Real-time Alert Display**: Shows all active alerts from all vehicles in the system
- **Severity-based Grouping**: Critical alerts are displayed separately with enhanced visual priority
- **Alert Resolution**: One-click resolution of alerts directly from the modal
- **Auto-refresh**: Manual refresh capability to get the latest alert data
- **Visual Indicators**: Color-coded alerts with emoji icons for different alert types

### Vehicle Status Page Integration
- **Alert Badge**: Shows critical alert count with visual notification badge
- **Auto-detection**: Automatically checks for new alerts every 10 seconds
- **Sound Notification**: Plays audio beep for new critical alerts
- **Toast Notifications**: Shows popup notifications for new critical alerts
- **Auto-popup**: Critical alerts automatically open the alert modal

## Alert Types & Icons
- 🔋 **LOW_ENERGY**: Battery/energy level alerts
- ⚡ **SPEED_OVER_LIMIT**: Speed limit violations
- 📶 **CONNECTION_LOST**: Communication/connectivity issues
- 🔧 **ENGINE_ISSUE**: Engine-related problems
- 🌡️ **OIL_TEMP_HIGH / COOLANT_TEMP_HIGH**: Temperature alerts
- 🛢️ **OIL_PRESSURE_LOW**: Oil pressure warnings
- ⛽ **FUEL_PRESSURE_LOW**: Fuel pressure warnings
- ⚠️ **Default**: Generic alert indicator

## Severity Levels
- **CRITICAL**: Red color coding, prioritized display, auto-popup
- **HIGH**: Warning/orange color coding
- **MEDIUM**: Secondary color coding
- **LOW**: Tertiary color coding

## How to Use

### Viewing Alerts
1. Click the "Alerts" button on the Vehicle Status Page
2. The modal will display all active alerts grouped by severity
3. Critical alerts appear at the top with red highlighting
4. Each alert shows:
   - Vehicle license plate
   - Alert type with icon
   - Severity tag
   - Description
   - Timestamp

### Resolving Alerts
1. Click the "Resolve" button next to any alert
2. The alert will be marked as resolved in the backend
3. The alert list will refresh automatically
4. Resolved alerts are removed from the active alerts view

### Alert Notifications
- Critical alerts trigger automatic notifications
- Audio beep sounds for new critical alerts
- Toast notifications appear for new critical alerts
- Alert badge shows count of active critical alerts
- Button pulses when critical alerts are present

## Technical Details
- **Backend API**: Connects to alert endpoints at `http://34.151.113.63:8080/api/alert/`
- **Refresh Rate**: Vehicle data refreshes every 30 seconds, alerts every 10 seconds
- **Data Source**: Fetches alerts from all vehicles via license plate lookup
- **Error Handling**: Graceful handling of API failures with console logging

## States
- **Loading**: Shows loading indicator while fetching data
- **No Alerts**: Displays "All Clear" message with green checkmark
- **Active Alerts**: Shows categorized list of current alerts
- **Error State**: Handles and logs API connection issues