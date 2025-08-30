import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Landing from "./Landing";
import Dashboard from "./Dashboard";

const Index = () => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  // Show landing page for non-authenticated users, dashboard for authenticated users
  if (!user) {
    return <Landing />;
  }

  return <Dashboard />;
};

export default Index;
