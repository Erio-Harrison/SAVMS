import { useState, useEffect } from "react";
import Map from "../components/Map";
import { Tabs, TabPane } from "@douyinfe/semi-ui";
import { IconFile, IconGlobe } from "@douyinfe/semi-icons";
import TaskDetailCard from "../components/TaskDetailCard.jsx";
import CreateTaskCard from "../components/CreateTaskCard.jsx";

export default function CurrentTasksPage() {
    const [tasks, setTasks] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [coordinate, setCoordinate] = useState({ lat: -35.2809, lng: 149.1300 });

    useEffect(() => {
        // 模拟静态任务数据
        const dummyTasks = [
            { id: 1, title: "Delivery #1", description: "Deliver to Civic", lat: -35.2600, lng: 149.1300 },
            { id: 2, title: "Pickup #2", description: "Pickup from Fyshwick", lat: -35.2800, lng: 149.1500 },
            { id: 3, title: "Delivery #3", description: "Deliver to Gungahlin", lat: -35.2900, lng: 149.1400 },
            { id: 1, title: "Delivery #1", description: "Deliver to Civic", lat: -35.2600, lng: 149.1300 },
            { id: 2, title: "Pickup #2", description: "Pickup from Fyshwick", lat: -35.2800, lng: 149.1500 },
            { id: 3, title: "Delivery #3", description: "Deliver to Gungahlin", lat: -35.2900, lng: 149.1400 },
            { id: 1, title: "Delivery #1", description: "Deliver to Civic", lat: -35.2600, lng: 149.1300 },
            { id: 2, title: "Pickup #2", description: "Pickup from Fyshwick", lat: -35.2800, lng: 149.1500 },
            { id: 3, title: "Delivery #3", description: "Deliver to Gungahlin", lat: -35.2900, lng: 149.1400 },
            { id: 1, title: "Delivery #1", description: "Deliver to Civic", lat: -35.2600, lng: 149.1300 },
            { id: 2, title: "Pickup #2", description: "Pickup from Fyshwick", lat: -35.2800, lng: 149.1500 },
            { id: 3, title: "Delivery #3", description: "Deliver to Gungahlin", lat: -35.2900, lng: 149.1400 },
            { id: 1, title: "Delivery #1", description: "Deliver to Civic", lat: -35.2600, lng: 149.1300 },
            { id: 2, title: "Pickup #2", description: "Pickup from Fyshwick", lat: -35.2800, lng: 149.1500 },
            { id: 3, title: "Delivery #3", description: "Deliver to Gungahlin", lat: -35.2900, lng: 149.1400 },
        ];

        // 设置任务列表和标记
        setTasks(dummyTasks);
        setMarkers(dummyTasks.map(task => ({ lat: task.lat, lng: task.lng })));
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
                                {tasks.length > 0 ? (
                                    tasks.map((task) => (
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
                            <div className="text-center text-gray-500">No unassigned tasks.</div>
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
                        <CreateTaskCard onCreate={() => console.log("Create new task")} />
                    </div>
                </div>

                {/* 地图区域，占3/4高度 */}
                <div className="h-3/4 bg-white rounded-3xl overflow-hidden">
                    <Map
                        lat={coordinate.lat}
                        lng={coordinate.lng}
                        markers={markers}
                        onMarkerClick={handleMarkerClick}
                    />
                </div>
            </div>
        </div>
    );
}
