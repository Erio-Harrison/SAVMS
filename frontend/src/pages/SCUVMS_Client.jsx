import { useState } from "react";
import ClientTasksPage from "./ClientTasksPage.jsx";
import ClientProfilePage from "./ClientProfilePage.jsx";
import ClientSidebar from "../components/ClientSidebar";

export default function SCUVMS() {
    const [selectedPage, setSelectedPage] = useState("ClientTasksPage");
    const user = JSON.parse(localStorage.getItem("user"));

    const renderPage = () => {
        switch (selectedPage) {
            case "ClientTasksPage":
                return <ClientTasksPage />;
            case "ProfilePage":
                return <ClientProfilePage />;
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
