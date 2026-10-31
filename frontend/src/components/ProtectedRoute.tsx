import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "JOB_SEEKER" | "COMPANY";
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, token } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    const fallback = user.role === "COMPANY" ? "/jobs" : "/jobs";
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}