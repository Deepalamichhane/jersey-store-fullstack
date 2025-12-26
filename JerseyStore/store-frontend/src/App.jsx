import React, { useState, useContext, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserContext } from './context/UserContext'; 
import { CartContext } from './context/CartContext'; 
import { Loader2 } from 'lucide-react';

// Layout & UI Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar'; 
import AuthModal from './components/Authmodal';
import ProtectedRoute from './components/ProtectedRoute';
import SocialAuthRedirect from './components/SocialauthRedirect';

// Page Components
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import UserDashboard from './pages/UserDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Success from './pages/Success'; 
import CancelPage from './pages/Cancel';
import CartPage from './pages/CartPage';
import AdminDashboard from './pages/AdminDashboard';
import SettingsPage from './pages/Settingspage';
import OrderHistoryPage from './components/OrderHistoryPage'; 
import OrderDetailsPage from './pages/OrderDetailsPage';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, loading } = useContext(UserContext); 
  const { cleanupGhostCart } = useContext(CartContext); 
  
  // Use a ref to track if cleanup has already been initiated for the current session
  const hasCleanedUp = useRef(false);

  /**
   * --- STABILIZED GHOST CART CLEANUP ---
   * This logic ensures that if a user just finished a purchase or logged in,
   * any stale local storage cart IDs are cleared and synced with the DB.
   */
  useEffect(() => {
    // 1. Only run if we are NOT loading and a user exists
    if (!loading && user) {
      // 2. Prevent multiple simultaneous execution
      if (hasCleanedUp.current) return;

      const performCleanup = async () => {
        try {
          hasCleanedUp.current = true;
          await cleanupGhostCart();
        } catch (error) {
          console.error("Ghost cart sync failed:", error);
          // Allow retry on next mount/user change if it failed
          hasCleanedUp.current = false; 
        }
      };

      performCleanup();
    } else if (!user) {
      // Reset the flag if the user logs out
      hasCleanedUp.current = false;
    }
  }, [user, loading, cleanupGhostCart]);

  // Loading Screen: Stadium Entrance
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#3C486B]" size={48} />
          <p className="font-anton uppercase italic text-[#3C486B] tracking-widest">
            Entering the Arena...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-[#3C486B] selection:text-white">
      
      <Navbar onUserClick={() => setIsModalOpen(true)} />
      
      <CartSidebar />

      <AuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <main className="flex-grow">
        <Routes>
          {/* Shop & Discovery */}
          <Route path="/" element={<ProductList />} />
          <Route path="/shop" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />}/>
          
          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/social-auth" element={<SocialAuthRedirect />} />
          
          {/* Checkout Flow */}
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>}/>
          <Route path="/success" element={<Success />} /> 
          <Route path="/cancel" element={<CancelPage />} />
          
          {/* User Account & History */}
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} /> 
          
          {/* Admin Management */}
          <Route path="/admin-panel" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard /> 
            </ProtectedRoute>
          }/>
        </Routes>
      </main>

      <Footer /> 
    </div>
  );
}

export default App;