import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        color: "var(--text-muted)",
        fontSize: "14px",
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/flights" replace />;
  }

  return children;
};

export default ProtectedRoute;
