import { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import SCUVMS from "./pages/SCUVMS";
import RegisterAndLogin from "./pages/RegisterAndLogin";

export default function AppRoutes() {
  const { id } = useContext(UserContext);

  return (
    <Router>
      <Routes>
        <Route path="/scuvms" element={id ? <SCUVMS /> : <Navigate to="/login" />} />

        <Route path="/login" element={id ? <Navigate to="/scuvms" /> : <RegisterAndLogin />} />

        <Route path="/" element={id ? <Navigate to="/scuvms" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
