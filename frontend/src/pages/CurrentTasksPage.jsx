import { useState, useEffect } from "react";
import Map from "../components/Map";
import Sidebar from "../components/Sidebar";

export default function CurrentTasksPage() {
    const [tasks, setTasks] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [coordinate, setCoordinate] = useState({ lat: -35.2809, lng: 149.1300 });

    useEffect(() => {
        // Simulated task data (replace with real API later)
        const dummyTasks = [
            { id: 1, title: "Delivery #1", description: "Deliver to Civic", lat: -35.2600, lng: 149.1300 },
            { id: 2, title: "Pickup #2", description: "Pickup from Fyshwick", lat: -35.2800, lng: 149.1500 },
        ];
        setTasks(dummyTasks);
        setMarkers(dummyTasks.map(task => ({ lat: task.lat, lng: task.lng })));
    }, []);

    const handleMarkerClick = (marker) => {
        console.log("Task marker clicked:", marker);
        // Could show task details here
    };

    return (
        <div className="bg-primary h-screen flex p-4 font-sans gap-4">
            {/* Sidebar if needed */}
            {/* <Sidebar onSelectPage={(page) => console.log("Page:", page)} /> */}

            {/* Left: Task List */}
            <div className="flex flex-col w-1/4 gap-4 flex-grow">
                <div className="text-2xl font-bold">Current Tasks</div>
                <div className="bg-accent rounded-3xl p-4 flex flex-col h-screen overflow-auto">
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <div
                                key={task.id}
                                className="p-2 border-b border-gray-200 flex flex-col"
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

            {/* Right: Map */}
            <div className="flex flex-col w-3/4 gap-4">
                <div className="h-full bg-white rounded-3xl">
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
