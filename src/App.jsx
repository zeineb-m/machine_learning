import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "@/protectedRoute/ProtectedRoute";
import IsLoading from "./configs/isLoading";

// Lazy-loaded components
const Dashboard = lazy(() => import("@/layouts/Dashboard"));
const Auth = lazy(() => import("@/layouts/Auth"));
const ForgotPassword = lazy(() => import("@/layouts/ForgotPassword"));
const ResetPassword = lazy(() => import("@/layouts/ResetPassword"));
const Home = lazy(() => import("./pages/home/Home"));

function App() {
  return (
    <Suspense fallback={IsLoading}>
      <Routes>
        <Route path="/dashboard/*" element={<ProtectedRoute />}>
          <Route path="*" element={<Dashboard />} />
        </Route>
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/index" element={<Home />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
