// src/routes/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, role = "admin" }) {
  const token = localStorage.getItem("spay_token");
  const raw = localStorage.getItem("spay_user");
  const location = useLocation();

  // Not logged in → go to login, remember where they wanted to go
  if (!token || !raw) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but wrong role → send to home
  try {
    const user = JSON.parse(raw);
    if (role && user.role !== role) {
      return <Navigate to="/" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }

  return children;
}