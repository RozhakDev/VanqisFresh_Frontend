import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/stores/auth";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/home/Home";
import ProductDetail from "./pages/catalog/ProductDetail";
import Cart from "./pages/checkout/Cart";
import Checkout from "./pages/checkout/Checkout";
import Payment from "./pages/checkout/Payment";
import OrderDetail from "./pages/orders/OrderDetail";
import NotFound from "./pages/errors/NotFound";
import Login from "./pages/account/Login";
import Register from "./pages/account/Register";
import Profile from "./pages/account/Profile";
import VerifyEmail from "./pages/account/VerifyEmail";

import OrderHistory from "./pages/orders/OrderHistory";

const queryClient = new QueryClient();

/**
 * Merender kerangka aplikasi utama beserta router, provider, dan layout global.
 *
 * @returns Struktur aplikasi tingkat atas.
 */
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
        {/* Notifikasi */}
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
        {/* Router Aplikasi */}
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-vanqis-base-layout">
            {/* Header */}
            <Header />
            {/* Konten Utama */}
            <main className="flex-1 pb-20 sm:pb-0">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment/:publicId" element={<Payment />} />
                <Route path="/order/:publicId" element={<OrderDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            {/* Footer */}
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
