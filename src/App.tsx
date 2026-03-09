import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Portfolio from "./pages/Portfolio";
import Orders from "./pages/Orders";
import OrderQueue from "./pages/OrderQueue";
import Partners from "./pages/Partners";
import Shop from "./pages/Shop";
import ShopItemPage from "./pages/ShopItem";
import Casino from "./pages/Casino";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ServerError from "./pages/ServerError";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

const queryClient = new QueryClient();

/**
 * Detect if the current hostname is a dashboard subdomain.
 * Matches: dashboard.74hrs.store, dashboard.localhost, etc.
 */
const isDashboardSubdomain = (): boolean => {
  const hostname = window.location.hostname;
  return hostname.startsWith("dashboard.");
};

/**
 * Dashboard app — served on dashboard.74hrs.store
 * Contains login, dashboard, admin, and settings routes.
 */
const DashboardApp = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

/**
 * Main marketing site — served on 74hrs.store
 * Contains all public pages + fallback dashboard routes.
 */
const MainApp = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/queue" element={<OrderQueue />} />
      <Route path="/partners" element={<Partners />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/shop/:itemId" element={<ShopItemPage />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route path="/error" element={<ServerError />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Toaster />
        <Sonner />
        {isDashboardSubdomain() ? <DashboardApp /> : <MainApp />}
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
