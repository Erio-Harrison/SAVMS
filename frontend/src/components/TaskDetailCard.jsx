import '../assets/TaskCardStyle.css'
export default function TaskDetailCard({ task, onEndTask }) {
    if (!task) {
        return (
            <div className="task-card shadow-md rounded-2xl p-4 w-full">
                <div className="font-semibold text-lg mb-1">Task Details</div>
                <div className="text-sm text-gray-500">Click on a marker to view details.</div>
            </div>
        );
    }

    return (
        <div className="task-card shadow-md rounded-2xl p-4 w-full flex justify-between items-center">
            {/* Left side task information */}
            <div className="w-2/3">
                <div className="font-semibold text-lg mb-2">Task Details</div>
                {/* Task information */}
                <div className="text-sm text-gray-800 mb-2">
                    <div><strong>Task ID:</strong> {task.id}</div>
                    <div><strong>Start Time:</strong> {task.startTime}</div>
                    <div><strong>Start Address:</strong> {task.startLocation?.address}</div>
                    <div><strong>End Address:</strong> {task.endLocation?.address}</div>
                    {/* Show license plate only if task has been assigned to vehicle (assuming status ≠ 0) */}
                    {task.status !== 0 && task.vehicle?.plateNumber && (
                        <div><strong>Car License:</strong> {task.vehicle.plateNumber}</div>
                    )}
                </div>
            </div>

            {/* Show finish button only if task has been assigned to vehicle (assuming status ≠ 0) */}
            {task.status !== 0 && (
                <div className="flex items-center justify-center w-1/3">
                    <button
                        onClick={() => onEndTask(task.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition"
                    >
                        End Task
                    </button>
                </div>
            )}
        </div>
    );
}
