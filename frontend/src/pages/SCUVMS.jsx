import { useState, useEffect } from "react";

// Admin components
import Sidebar from "../components/Sidebar";
import MainPage from "./MainPage.jsx";
import MapPage from "./MapPage.jsx";
import CurrentTasksPage from "./CurrentTasksPage.jsx";
import TestPage from "./testPage.jsx";
// Client components
import ClientTasksPage from "./ClientTasksPage.jsx";
import ClientSidebar from "../components/ClientSidebar";
import SCUVMS_Client from "./SCUVMS_Client.jsx";
import ProfilePage from "./ProfilePage.jsx";


export default function SCUVMS() {

    const [selectedPage, setSelectedPage] = useState("MainPage");
    const user = JSON.parse(localStorage.getItem("user"));

    // 通过 selectedPage 渲染不同组件
    const renderPage = () => {
        switch (selectedPage) {
            case "MainPage":
                return <MainPage />;
            case "MapPage":
                return <MapPage />;
            case "CurrentTasksPage":
                return <CurrentTasksPage />;
            case "testPage":
                return <TestPage />;
            case "ProfilePage":
                return <ProfilePage />;
            default:
                return <MainPage />;
        }
    };

    return (
        <div className="bg-primary h-screen flex p-4 font-sans gap-4">
            <Sidebar onSelectPage={setSelectedPage} />
            <div className="flex-grow">{renderPage()}</div>
        </div>
    );
}
