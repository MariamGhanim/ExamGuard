import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import VerifyCodePage from "./pages/VerifyCodePage";
import HomePage from "./pages/HomePage";
import HelpPage from "./pages/HelpPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify-code" element={<VerifyCodePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
