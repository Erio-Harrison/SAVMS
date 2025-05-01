export default function CreateTaskCard({ onCreate }) {
    return (
        <div className="bg-[#f5f7fb] shadow-md rounded-2xl p-4 w-full flex items-center justify-center">
            <button
                onClick={onCreate}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
            >
                + Create New Task
            </button>
        </div>
    );
}
