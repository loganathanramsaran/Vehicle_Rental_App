import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");

  // If no token, redirect to login
  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);

    // Admin-only route check
    if (adminOnly && !decoded.isAdmin) {
      return <Navigate to="/dashboard" />;
    }

    // If everything is good, render the protected content
    return children;
  } catch (err) {
    console.error("Invalid token:", err);
    localStorage.removeItem("token"); // clear corrupted token
    return <Navigate to="/login" />;
  }
}

export default ProtectedRoute;
