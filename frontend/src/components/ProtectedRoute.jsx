import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Spinner } from "./Loader";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useApp();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-ink-50">
        <Spinner size={24} className="text-ink-400" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
