import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/stores/auth";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentUpload from "./pages/PaymentUpload";
import OrderStatus from "./pages/OrderStatus";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/auth/Profile";

import Orders from "./pages/Orders";

const queryClient = new QueryClient();

const App = () => {
  const fetchProfile = useAuthStore((state) => state.fetchProfile);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (token && !isAuthenticated) {
      fetchProfile();
    }
  }, [fetchProfile, isAuthenticated]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner 
          toastOptions={{
            style: {
              background: '#FFFFFF',
              border: '2px solid #111213',
              borderRadius: '0',
              color: '#111213',
              boxShadow: '4px 4px 0 rgba(17, 18, 19, 0.1)',
              fontFamily: 'inherit',
            },
            className: 'font-bold uppercase tracking-widest text-xs',
          }}
        />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-vanqis-base-layout">
            <Header />
            <main className="flex-1 pb-20 sm:pb-0">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment/:publicId" element={<PaymentUpload />} />
                <Route path="/order/:publicId" element={<OrderStatus />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
