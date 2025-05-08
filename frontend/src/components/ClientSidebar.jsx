export default function ClientSidebar({ onSelectPage }) {
    return (
        <div className="bg-black rounded-full w-11 flex flex-col items-center gap-4 px-2 py-48 justify-between">
            {/* Task Page */}
            <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512"
                 onClick={() => onSelectPage("ClientTasksPage")}>
                <path fill="white"
                      d="M680-80q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80Zm67-105 28-28-75-75v-112h-40v128l87 87Zm-547 65q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h167q11-35 43-57.5t70-22.5q40 0 71.5 22.5T594-840h166q33 0 56.5 23.5T840-760v250q-18-13-38-22t-42-16v-212h-80v120H280v-120h-80v560h212q7 22 16 42t22 38H200Z" />
            </svg>

            {/* Profile Page icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512"
                 onClick={() => onSelectPage("ProfilePage")}>
                <path fill="white"
                      d="M432 480H80a31 31 0 01-24.2-11.13c-6.5-7.77-9.12-18.38-7.18-29.11C57.06 392.94 83.4 353.61 124.8 326c36.78-24.51 83.37-38 131.2-38s94.42 13.5 131.2 38c41.4 27.6 67.74 66.93 76.18 113.75 1.94 10.73-.68 21.34-7.18 29.11A31 31 0 01432 480z" />
                <circle fill="white" cx="256" cy="256" r="48" />
            </svg>
        </div>
    );
}
