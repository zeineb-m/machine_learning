import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth, ForgotPassword, ResetPassword } from "@/layouts";
import ProtectedRoute from "@/protectedRoute/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<ProtectedRoute />}>
        <Route path="*" element={<Dashboard />} />
      </Route>
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
    </Routes>
  );
}

export default App;
