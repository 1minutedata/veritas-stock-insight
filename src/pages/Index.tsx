import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Landing from "./Landing";
import Dashboard from "./Dashboard";

const Index = () => {
  const { user } = useAuth();

  // Show landing page for non-authenticated users, dashboard for authenticated users
  if (!user) {
    return <Landing />;
  }

  return <Dashboard />;
};

export default Index;
