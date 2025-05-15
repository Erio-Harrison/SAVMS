import { useState, useEffect } from "react";
import Map from "../components/Map";
import TaskRouteMap from "../components/TaskRouteMap";
import { Tabs, TabPane } from "@douyinfe/semi-ui";
import { IconFile, IconGlobe } from "@douyinfe/semi-icons";
import { Modal, Form, Button, Toast } from "@douyinfe/semi-ui";
import TaskDetailCard from "../components/TaskDetailCard.jsx";
import CreateTaskCard from "../components/CreateTaskCard.jsx";
import axiosInstance from "../axiosInstance";

export default function CurrentTasksPage() {
    const [tasks, setTasks] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [coordinate, setCoordinate] = useState({ lat: -35.2809, lng: 149.1300 });
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [assignedTasks, setAssignedTasks] = useState([]);
    const [unAssignedTasks, setUnAssignedTasks] = useState([]);


    useEffect(() => {
        const fetchAssignedTasks = async () => {
            try {
                const res = await axiosInstance.get("/api/tasks/status/1"); // 你的后端实际路径
                const fetchedAssignTasks = res.data.data;

                setAssignedTasks(fetchedAssignTasks);
                console.log("Fetched assigned tasks:", fetchedAssignTasks);
            } catch (err) {
                console.error("Error fetching tasks:", err);
            }
        };

        fetchAssignedTasks();

        const fetchUnAssignedTasks = async () => {
            try {
                const res = await axiosInstance.get("/api/tasks/status/0"); // 你的后端实际路径
                const fetchedUnAssignTasks = res.data.data;

                setUnAssignedTasks(fetchedUnAssignTasks);

            } catch (err) {
                console.error("Error fetching tasks:", err);
            }
        };

        fetchUnAssignedTasks();

    }, []);

    const handleMarkerClick = (marker) => {
        console.log("Task marker clicked:", marker);
        // 根据点击的marker更新坐标
        setCoordinate({ lat: marker.lat, lng: marker.lng });
    };

    const handleTaskClick = (task) => {
        // 选中任务时更新 selectedTask
        setSelectedTask(task);
    };

    const handleCreateTask = (values) => {
        const newTask = {
            id: values.id,
            title: `Task #${values.id}`,
            description: `From ${values.startAddress} to ${values.endAddress}`,
            lat: coordinate.lat,
            lng: coordinate.lng,
        };
        setTasks(prev => [...prev, newTask]);
        setMarkers(prev => [...prev, { lat: newTask.lat, lng: newTask.lng }]);
        Toast.success("Task created!");
        setCreateModalVisible(false);
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
                                            onClick={() => handleTaskClick(task)} // 点击任务时更新选中的任务
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
                                Unassigned task
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
                                            className="p-2 border-b border-gray-200 flex flex-col cursor-pointer"
                                            onClick={() => handleTaskClick(task)} // 点击任务时更新选中的任务
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
                </Tabs>
            </div>

            {/* Right: Top Card + Map below */}
            <div className="flex flex-col w-3/4 gap-4">
                <div className="flex justify-between items-center h-1/4 gap-4 px-2">
                    <div className="w-2/3">
                        {/* 显示选中的任务详情 */}
                        <TaskDetailCard task={selectedTask} />
                    </div>
                    <div className="w-1/3">
                        <CreateTaskCard onCreate={() => setCreateModalVisible(true)} />
                    </div>
                </div>

                {/* 地图区域，占3/4高度 */}
                {/*<div className="h-3/4 bg-white rounded-3xl overflow-hidden">*/}
                {/*    <Map*/}
                {/*        lat={coordinate.lat}*/}
                {/*        lng={coordinate.lng}*/}
                {/*        markers={markers}*/}
                {/*        onMarkerClick={handleMarkerClick}*/}
                {/*    />*/}
                {/*</div>*/}

                <div className="h-3/4 bg-white rounded-3xl overflow-hidden">
                    {selectedTask ? (
                        <TaskRouteMap
                            origin={{ lat: parseFloat(selectedTask.startLocation.lat), lng: parseFloat(selectedTask.startLocation.lng) }}
                            destination={{ lat: parseFloat(selectedTask.endLocation.lat), lng: parseFloat(selectedTask.endLocation.lng) }}
                            vehiclePosition={{ lat: -35.2900173, lng: 149.1396061 }}
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
                    onCancel={() => setCreateModalVisible(false)}
                    footer={null}
                >
                    <Form onSubmit={handleCreateTask}>
                        <Form.Input field="id" label="Task ID" placeholder="e.g., 101" required />
                        <Form.Input field="startTime" label="Start Time" placeholder="e.g., 2025-04-17 09:00" required />
                        <Form.Input field="endTime" label="End Time" placeholder="e.g., 2025-04-17 10:30" required />
                        <Form.Input field="startAddress" label="Start Address" placeholder="e.g., Civic Square" required />
                        <Form.Input field="endAddress" label="End Address" placeholder="e.g., Gungahlin Station" required />
                        <Form.Input field="license" label="Car License" placeholder="e.g., XYZ-123" required />

                        <div className="flex justify-end pt-4">
                            <Button onClick={() => setCreateModalVisible(false)} style={{ marginRight: 8 }}>
                                Cancel
                            </Button>
                            <Button theme="solid" type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        </div>
    );
}
