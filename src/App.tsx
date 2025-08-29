
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Assistant from "./pages/Assistant";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Success from "./pages/Success";
import Integrations from "./pages/Integrations";
import Payments from "./pages/Payments";
import LinkCard from "./pages/LinkCard";
import Shop from "./pages/Shop";
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
            {/* Default: Your Assistant */}
            <Route path="/" element={<Layout><Assistant /></Layout>} />

            {/* Live Market Insights */}
            <Route path="/market" element={<Layout><Dashboard /></Layout>} />

            {/* Manage Integrations */}
            <Route path="/integrations" element={<Layout><Integrations /></Layout>} />

            {/* Payment Processing */}
            <Route path="/payments" element={<Layout><Payments /></Layout>} />

            {/* Linking Your Card */}
            <Route path="/link-card" element={<Layout><LinkCard /></Layout>} />

            {/* Build Your Shop */}
            <Route path="/shop" element={<Layout><Shop /></Layout>} />

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
