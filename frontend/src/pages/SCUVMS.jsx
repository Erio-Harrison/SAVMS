import { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import MainPage from "./MainPage.jsx";


export default function SCUVMS() {

    const [selectedPage, setSelectedPage] = useState("MainPage");

    // 通过 selectedPage 渲染不同组件
    const renderPage = () => {
        switch (selectedPage) {
            case "MainPage":
                return <MainPage />;
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
