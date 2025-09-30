import { useState, useEffect, useRef } from "react";
import Map from "../components/Map";
import TaskRouteMap from "../components/TaskRouteMap";
import { Tabs, TabPane } from "@douyinfe/semi-ui";
import { IconFile, IconGlobe, IconChecklistStroked } from "@douyinfe/semi-icons";
import { Modal, Form, Button, Toast } from "@douyinfe/semi-ui";
import TaskDetailCard from "../components/TaskDetailCard.jsx";
import CreateTaskCard from "../components/CreateTaskCard.jsx";
import TaskAssignmentModal from "../components/TaskAssignmentModal.jsx";
import axiosInstance from "../axiosInstance";
import {Autocomplete} from "@react-google-maps/api";

export default function CurrentTasksPage() {
    const [tasks, setTasks] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [coordinate, setCoordinate] = useState({ lat: -35.2809, lng: 149.1300 });
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [assignedTasks, setAssignedTasks] = useState([]);
    const [unAssignedTasks, setUnAssignedTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [alertVisible, setAlertVisible] = useState(false);
    const [assignmentModalVisible, setAssignmentModalVisible] = useState(false);
    const [taskToAssign, setTaskToAssign] = useState(null);
    const [startLocationCoords, setStartLocationCoords] = useState(null);
    const [endLocationCoords, setEndLocationCoords] = useState(null);
    const alertTimerRef = useRef(null);
    const formApiRef = useRef(null);

    useEffect(() => {
        // clear timer when unmounting component
        return () => {
            if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
        };
    }, []);


    useEffect(() => {
        refreshTasks();
    }, []);

    const refreshTasks = () => {
        fetchAssignedTasks();
        fetchUnAssignedTasks();
        fetchCompletedTasks();
    };

    const fetchAssignedTasks = async () => {
        try {
            const res = await axiosInstance.get("/api/tasks/status/1");
            const fetchedAssignTasks = res.data.data;
            setAssignedTasks(fetchedAssignTasks);
            console.log("Fetched assigned tasks:", fetchedAssignTasks);
        } catch (err) {
            console.error("Error fetching assigned tasks:", err);
        }
    };

    const fetchUnAssignedTasks = async () => {
        try {
            const res = await axiosInstance.get("/api/tasks/status/0");
            const fetchedUnAssignTasks = res.data.data;
            setUnAssignedTasks(fetchedUnAssignTasks);
        } catch (err) {
            console.error("Error fetching unassigned tasks:", err);
        }
    };

    const fetchCompletedTasks = async () => {
        try {
            const res = await axiosInstance.get("/api/tasks/completed");
            const fetchedCompletedTasks = res.data.data;
            setCompletedTasks(fetchedCompletedTasks);
        } catch (err) {
            console.error("Error fetching completed tasks:", err);
        }
    };

    const handleAssignTask = (task) => {
        setTaskToAssign(task);
        setAssignmentModalVisible(true);
    };

    const handleUnassignTask = async (taskId) => {
        try {
            await axiosInstance.post(`/api/tasks/${taskId}/unassign`);
            Toast.success("Task unassigned successfully");
            refreshTasks();
        } catch (error) {
            console.error("Error unassigning task:", error);
            Toast.error("Failed to unassign task");
        }
    };

    const handleAssignmentSuccess = () => {
        refreshTasks();
        setTaskToAssign(null);
    };

    const handleCompleteTask = async (taskId) => {
        try {
            await axiosInstance.post(`/api/tasks/${taskId}/complete`);
            Toast.success("Task completed successfully");
            refreshTasks();
        } catch (error) {
            console.error("Error completing task:", error);
            Toast.error("Failed to complete task");
        }
    };

    const handleMarkerClick = (marker) => {
        console.log("Task marker clicked:", marker);
        // Update coordinates based on clicked marker
        setCoordinate({ lat: marker.lat, lng: marker.lng });
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);

        if (alertTimerRef.current) {
            clearTimeout(alertTimerRef.current);
            alertTimerRef.current = null;
        }

        // if task.id === 204
        if (task.id === 204 || task.id === "204") {
            alertTimerRef.current = setTimeout(() => {
                setAlertVisible(true);
            }, 3000);
        } else {
            setAlertVisible(false);
        }
    };

    const handleCreateTask = async (values) => {
        try {
            const newTask = {
                title: values.title,
                description: values.description,
                startTime: values.startTime,
                status: 0, // Default to pending
                startLocation: {
                    address: values.startAddress,
                    lat: startLocationCoords?.lat || 0,
                    lng: startLocationCoords?.lng || 0
                },
                endLocation: {
                    address: values.endAddress,
                    lat: endLocationCoords?.lat || 0,
                    lng: endLocationCoords?.lng || 0
                }
            };
            
            const response = await axiosInstance.post('/api/tasks/create', newTask);
            Toast.success("Task created successfully!");
            setCreateModalVisible(false);
            setStartLocationCoords(null);
            setEndLocationCoords(null);
            refreshTasks(); // Refresh the task lists
        } catch (error) {
            console.error("Error creating task:", error);
            Toast.error("Failed to create task");
        }
    };

    return (
        <div className="bg-primary h-screen flex p-4 font-sans gap-4">
            {/* Left Panel */}
            <div className="flex flex-col w-1/4 gap-4">
                <div className="text-2xl font-bold">Task Management</div>
                <Tabs type="line" tabPosition="top">
                    <TabPane
                        tab={
                            <span>
                                <IconFile style={{ marginRight: 4 }} />
                                Current task
                            </span>
                        }
                        itemKey="1"
                    >
                        <div className="bg-accent rounded-3xl p-4 flex flex-col max-h-[calc(100vh-10rem)] overflow-auto">
                            <div className="overflow-y-auto">
                                {assignedTasks.length > 0 ? (
                                    assignedTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="p-2 border-b border-gray-200 flex flex-col cursor-pointer"
                                            onClick={() => handleTaskClick(task)} // Update selected task when clicking on task
                                        >
                                            <span className="font-semibold text-lg">{task.title}</span>
                                            <span className="text-sm text-gray-600">{task.description}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500">No current tasks.</div>
                                )}
                            </div>
                        </div>
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                                <IconGlobe style={{ marginRight: 4 }} />
                                Waiting List
                            </span>
                        }
                        itemKey="2"
                    >
                        <div className="bg-accent rounded-3xl p-4 flex flex-col max-h-[calc(100vh-10rem)] overflow-auto">
                            <div className="overflow-y-auto">
                                {unAssignedTasks.length > 0 ? (
                                    unAssignedTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="p-3 border-b border-gray-200 flex justify-between items-center"
                                        >
                                            <div
                                                className="flex flex-col cursor-pointer flex-1"
                                                onClick={() => handleTaskClick(task)}
                                            >
                                                <span className="font-semibold text-lg">{task.title}</span>
                                                <span className="text-sm text-gray-600">{task.description}</span>
                                                <span className="text-xs text-blue-600 mt-1">Status: Waiting for assignment</span>
                                            </div>
                                            <Button
                                                theme="solid"
                                                type="primary"
                                                size="small"
                                                onClick={() => handleAssignTask(task)}
                                                className="ml-2"
                                            >
                                                Assign
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500">No pending tasks.</div>
                                )}
                            </div>
                        </div>
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                                <IconChecklistStroked style={{ marginRight: 4 }} />
                                Finished Tasks
                            </span>
                        }
                        itemKey="3"
                    >
                        <div className="bg-accent rounded-3xl p-4 flex flex-col max-h-[calc(100vh-10rem)] overflow-auto">
                            <div className="overflow-y-auto">
                                {completedTasks.length > 0 ? (
                                    completedTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="p-3 border-b border-gray-200 flex flex-col cursor-pointer"
                                            onClick={() => handleTaskClick(task)}
                                        >
                                            <span className="font-semibold text-lg">{task.title}</span>
                                            <span className="text-sm text-gray-600">{task.description}</span>
                                            <span className="text-xs text-green-600 mt-1">Status: Completed</span>
                                            {task.endTime && (
                                                <span className="text-xs text-gray-500">Completed: {new Date(task.endTime).toLocaleString()}</span>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500">No completed tasks.</div>
                                )}
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
            </div>

            {/* Right: Top Card + Map below */}
            <div className="flex flex-col w-3/4 gap-4">
                <div className="flex justify-between items-center h-1/4 gap-4 px-2">
                    <div className="w-2/3">
                        {/* Display selected task details */}
                        <TaskDetailCard task={selectedTask} onUnassignTask={handleUnassignTask} onCompleteTask={handleCompleteTask} />
                    </div>
                    <div className="w-1/3">
                        <CreateTaskCard onCreate={() => setCreateModalVisible(true)} />
                    </div>
                </div>

                {/* Map area, occupies 3/4 height */}
                {/*<div className="h-3/4 bg-white rounded-3xl overflow-hidden">*/}
                {/*    <Map*/}
                {/*        lat={coordinate.lat}*/}
                {/*        lng={coordinate.lng}*/}
                {/*        markers={markers}*/}
                {/*        onMarkerClick={handleMarkerClick}*/}
                {/*    />*/}
                {/*</div>*/}

                <div className="h-3/4 bg-white rounded-3xl overflow-hidden">
                    {selectedTask && 
                     selectedTask.startLocation?.lat && 
                     selectedTask.endLocation?.lat && 
                     selectedTask.vehicleLocation?.lat ? (
                        <TaskRouteMap
                            origin={{ 
                                lat: parseFloat(selectedTask.startLocation.lat), 
                                lng: parseFloat(selectedTask.startLocation.lng) 
                            }}
                            destination={{ 
                                lat: parseFloat(selectedTask.endLocation.lat), 
                                lng: parseFloat(selectedTask.endLocation.lng) 
                            }}
                            vehiclePosition={{ 
                                lat: parseFloat(selectedTask.vehicleLocation.lat), 
                                lng: parseFloat(selectedTask.vehicleLocation.lng) 
                            }}
                        />
                    ) : (
                        <Map
                            lat={coordinate.lat}
                            lng={coordinate.lng}
                            markers={markers}
                            onMarkerClick={handleMarkerClick}
                        />
                    )}
                </div>



                {/* Create Task Modal */}
                <Modal
                    title="Create New Task"
                    visible={createModalVisible}
                    onCancel={() => {
                        setCreateModalVisible(false);
                        setStartLocationCoords(null);
                        setEndLocationCoords(null);
                    }}
                    footer={null}
                >
                    <Form onSubmit={handleCreateTask} getFormApi={(formApi) => (formApiRef.current = formApi)}>
                        <Form.Input field="title" label="Title" placeholder="The title of this task" required />
                        <Form.Input field="description" label="Description" placeholder="The detail for this task" required />
                        <Form.DatePicker
                            field="startTime"
                            label="Start Time"
                            type="dateTime"           // Enables both date & time
                            format="yyyy-MM-dd HH:mm" // Optional: Display format
                            required
                            placeholder="Select start date and time"
                        />
                        <Form.Slot label="Start Address" required>
                            <Autocomplete
                                onPlaceSelect={(place) => {
                                    const address = place.formatted_address;
                                    const lat = place.geometry.location.lat();
                                    const lng = place.geometry.location.lng();
                                    setStartLocationCoords({ lat, lng });
                                    formApiRef.current?.setValue('startAddress', address);
                                }}
                            >
                                <Form.Input field="startAddress" placeholder="Search Start Address" />
                            </Autocomplete>
                        </Form.Slot>
                        <Form.Slot label="End Address" required>
                            <Autocomplete
                                onPlaceSelect={(place) => {
                                    const address = place.formatted_address;
                                    const lat = place.geometry.location.lat();
                                    const lng = place.geometry.location.lng();
                                    setEndLocationCoords({ lat, lng });
                                    formApiRef.current?.setValue('endAddress', address);
                                }}
                            >
                                <Form.Input field="endAddress" placeholder="Search End Address" />
                            </Autocomplete>
                        </Form.Slot>

                        <div className="flex justify-end pt-4">
                            <Button onClick={() => {
                                setCreateModalVisible(false);
                                setStartLocationCoords(null);
                                setEndLocationCoords(null);
                            }} style={{ marginRight: 8 }}>
                                Cancel
                            </Button>
                            <Button theme="solid" type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </div>
                    </Form>
                </Modal>

                <Modal
                    title="Vehicle Off Track Alert"
                    visible={alertVisible}
                    onCancel={() => setAlertVisible(false)}
                    footer={
                        <Button theme="solid" type="primary" onClick={() => setAlertVisible(false)}>
                            Confirm
                        </Button>
                    }
                >
                    <p>The system found the vehicle is off track, please report the issue!</p>
                </Modal>

                {/* Task Assignment Modal */}
                <TaskAssignmentModal
                    visible={assignmentModalVisible}
                    onCancel={() => setAssignmentModalVisible(false)}
                    task={taskToAssign}
                    onAssignSuccess={handleAssignmentSuccess}
                />

            </div>
        </div>
    );
}
