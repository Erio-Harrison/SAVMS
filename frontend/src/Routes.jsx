import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import MainPage from "./pages/MainPage.jsx";    // 管理员页面（主页面）
import RegisterAndLogin from "./pages/RegisterAndLogin.jsx";
import ChatPage from './pages/ChatPage';// 客户聊天页面
import SCUVMS_Client from './pages/SCUVMS_Client.jsx'

export default function AppRoutes() {
    const { id, role } = useContext(UserContext); // 同时获取用户 id 和 role

    return (
        <Router>
            <Routes>
                {/* 登录页 */}
                <Route
                    path="/login"
                    element={
                        id
                            ? <Navigate to="/" replace />  // 如果已登录，重定向到根路由
                            : <RegisterAndLogin />
                    }
                />

                {/* 根路由：已登录根据角色跳转，未登录跳 login */}
                <Route
                    path="/"
                    element={
                        id
                            ? (
                                role === 'admin'
                                    ? <Navigate to="/admin" replace />  // 管理员重定向
                                    : <Navigate to="/chat" replace />   // 客户重定向至聊天页
                            )
                            : <Navigate to="/login" replace />
                    }
                />

                {/* 普通客户页面，仅 client 可访问 */}
                <Route
                    path="/client"
                    element={
                        id && role === 'client'
                            ? <SCUVMS_Client />
                            : <Navigate to="/login" replace /> // 未登录或非client跳 login
                    }
                />

                {/* 管理员页面，仅 admin 可访问 */}
                <Route
                    path="/admin"
                    element={
                        id && role === 'admin'
                            ? <MainPage />
                            : <Navigate to="/login" replace /> // 未登录或非admin跳 login
                    }
                />

                {/* 兜底：所有未匹配路由，都重定向到根 */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}
