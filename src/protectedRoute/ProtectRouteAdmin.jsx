import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

const protectRouteAdmin = () => {
  const { user } = useContext(AuthContext);
  return user && user.role === "admin" ? <Outlet /> : <Navigate to="/index" replace />;
}

export default protectRouteAdmin;
