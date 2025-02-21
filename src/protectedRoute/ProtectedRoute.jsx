import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

const ProtectedRoute = () => {
  const { user } = useContext(AuthContext);

  return user ? <Outlet /> : <Navigate to="/auth/sign-in" replace />;
};

export default ProtectedRoute;
