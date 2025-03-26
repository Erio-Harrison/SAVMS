import { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import SCUVMS from "./pages/SCUVMS";
import RegisterAndLogin from "./pages/RegisterAndLogin";
import ChatPage from "./pages/ChatPage"; // ✅ 引入 ChatPage

export default function AppRoutes() {
    const { id } = useContext(UserContext);

    return (
        <Router>
            <Routes>
                <Route path="/scuvms" element={id ? <SCUVMS /> : <Navigate to="/login" />} />

                {/* ✅ 新增 Chat 路由（不需要登录） */}
                <Route path="/chat" element={<ChatPage />} />

                <Route path="/login" element={id ? <Navigate to="/scuvms" /> : <RegisterAndLogin />} />
                <Route path="/" element={id ? <Navigate to="/scuvms" /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}
