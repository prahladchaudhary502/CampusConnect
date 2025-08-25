import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const ProtectedRoute = ({ element, allowedRoles, user }) => {
  const {loading} = useAppContext();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-gray-600">
        Loading...
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    toast.error("Unauthorized to access.");
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;
