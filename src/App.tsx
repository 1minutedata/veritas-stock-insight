
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Assistant from "./pages/Assistant";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Success from "./pages/Success";
import Integrations from "./pages/Integrations";
import Payments from "./pages/Payments";
import LinkCard from "./pages/LinkCard";
import Shop from "./pages/Shop";
import StockSimulator from "./pages/StockSimulator";
import NotFound from "./pages/NotFound";
import ChatWidget from "./components/ChatWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Landing/Dashboard route */}
            <Route path="/" element={<Index />} />

            {/* Your Assistant */}
            <Route path="/assistant" element={
              <ProtectedRoute>
                <Layout><Assistant /></Layout>
              </ProtectedRoute>
            } />

            {/* Live Market Insights */}
            <Route path="/market" element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } />

            {/* Manage Integrations */}
            <Route path="/integrations" element={
              <ProtectedRoute>
                <Layout><Integrations /></Layout>
              </ProtectedRoute>
            } />

            {/* Payment Processing */}
            <Route path="/payments" element={
              <ProtectedRoute>
                <Layout><Payments /></Layout>
              </ProtectedRoute>
            } />

            {/* Linking Your Card */}
            <Route path="/link-card" element={
              <ProtectedRoute>
                <Layout><LinkCard /></Layout>
              </ProtectedRoute>
            } />

            {/* Build Your Shop */}
            <Route path="/shop" element={
              <ProtectedRoute>
                <Layout><Shop /></Layout>
              </ProtectedRoute>
            } />

            {/* Stock Simulator */}
            <Route path="/stock-simulator" element={
              <ProtectedRoute>
                <Layout><StockSimulator /></Layout>
              </ProtectedRoute>
            } />

            {/* Auth & other pages (not in sidebar) */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/success" element={<Success />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatWidget />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
