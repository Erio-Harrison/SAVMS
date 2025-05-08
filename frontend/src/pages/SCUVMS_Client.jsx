import { useState } from "react";
import ClientTasksPage from "./ClientTasksPage.jsx";
import ClientSidebar from "../components/ClientSidebar";

export default function SCUVMS() {
    const [selectedPage, setSelectedPage] = useState("ClientTasksPage");
    const user = JSON.parse(localStorage.getItem("user"));

    const renderPage = () => {
        switch (selectedPage) {
            case "ClientTasksPage":
                return <ClientTasksPage />;
            case "ProfilePage":
                return <div className="text-white text-xl">Profile Page (Coming Soon)</div>;
            default:
                return <ClientTasksPage />;
        }
    };

    return (
        <div className="bg-primary h-screen flex p-4 font-sans gap-4">
            <ClientSidebar onSelectPage={setSelectedPage} />
            <div className="flex-grow">{renderPage()}</div>
        </div>
    );
}
