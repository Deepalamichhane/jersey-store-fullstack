import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { CartContext } from '../context/CartContext';
import { handleStripeCheckout, handleEsewaCheckout } from '../utils/paymentUtils';
import OrderSummary from '../components/OrderSummary'; 
import { Home, CreditCard, AlertTriangle, Wallet } from 'lucide-react';

export default function Checkout() {
  const { user, apiClient } = useContext(UserContext);
  
  const { 
    cart, 
    cartTotal, 
    shippingFee, 
    loyaltyDiscount, 
    finalTotal, 
    currentCartId 
  } = useContext(CartContext);
  
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [shippingDetails, setShippingDetails] = useState({
    address: user?.profile?.shipping_address || '',
    city: user?.profile?.city || '',
    zip: user?.profile?.zip_code || '',
  });

  const handlePayment = async () => {
    // 1. Basic Validation
    if (!user) return navigate('/login');
    if (cart.length === 0) return alert("Locker is empty");
    if (!shippingDetails.address || !shippingDetails.city) {
      return alert("Shipping details are required");
    }

    /**
     * FIX: GUARD CLAUSE FOR NULL CART ID
     * Prevents calling /api/cart/null/ which causes the 404 error.
     */
    if (!currentCartId || currentCartId === 'null') {
      alert("Cart session expired. Please refresh the page or re-add an item to your bag.");
      console.error("Checkout aborted: currentCartId is missing or string 'null'.");
      return;
    }

    setIsLoading(true);
    try {
      /**
       * FIX: DYNAMIC ENDPOINT
       * Using backticks ensures the currentCartId is correctly injected into the URL.
       */
      await apiClient.patch(`/api/cart/${currentCartId}/update_shipping/`, {
        shipping_address: shippingDetails.address,
        city: shippingDetails.city,
        zip_code: shippingDetails.zip,
        payment_method: paymentMethod
      });

      // Persist for verification on success/cancel pages
      localStorage.setItem('active_cart_id', currentCartId);

      // 2. Delegate to Payment Handlers
      if (paymentMethod === 'stripe') {
        await handleStripeCheckout(apiClient, currentCartId);
      } else {
        await handleEsewaCheckout(apiClient, currentCartId);
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      const errorMsg = err.response?.data?.detail || "Checkout failed. Please try again.";
      alert(errorMsg);
      setIsLoading(false);
    }
  };

  // EMPTY STATE
  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-6">
        <AlertTriangle size={48} className="text-[#E14D2A] mb-4"/>
        <h2 className="text-4xl font-anton uppercase italic mb-8 text-[#3C486B]">Checkout Empty</h2>
        <Link to="/shop" className="bg-[#3C486B] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-colors">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: FORMS */}
        <div className="lg:col-span-7 space-y-8">
          <header>
            <h1 className="font-anton text-6xl italic uppercase tracking-tighter text-[#3C486B]">The Arena</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E14D2A]">Secure Match-Day Delivery</p>
          </header>

          {/* SHIPPING DESTINATION */}
          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="flex items-center gap-2 font-black text-[11px] uppercase tracking-widest mb-6 text-[#3C486B]">
              <Home size={16} className="text-[#E14D2A]" /> 01. Shipping Destination
            </h3>
            <div className="space-y-4">
              <Input 
                label="Street Address" 
                value={shippingDetails.address} 
                onChange={(v) => setShippingDetails({...shippingDetails, address: v})} 
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="City" 
                  value={shippingDetails.city} 
                  onChange={(v) => setShippingDetails({...shippingDetails, city: v})} 
                />
                <Input 
                  label="Postcode" 
                  value={shippingDetails.zip} 
                  onChange={(v) => setShippingDetails({...shippingDetails, zip: v})} 
                />
              </div>
            </div>
          </section>

          {/* PAYMENT GATEWAY */}
          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="flex items-center gap-2 font-black text-[11px] uppercase tracking-widest mb-6 text-[#3C486B]">
              <CreditCard size={16} className="text-[#E14D2A]" /> 02. Secure Gateway
            </h3>
            <div className="space-y-3">
              <PaymentOption 
                id="stripe" 
                active={paymentMethod} 
                setter={setPaymentMethod} 
                title="Global Card / Stripe" 
                sub="Visa, Master, Apple Pay" 
                icon={<CreditCard size={20} />} 
              />
              <PaymentOption 
                id="esewa" 
                active={paymentMethod} 
                setter={setPaymentMethod} 
                title="eSewa Wallet" 
                sub="Local Nepal Payment" 
                icon={<Wallet size={20} className="text-green-600"/>} 
              />
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div className="lg:col-span-5 lg:sticky lg:top-10">
          <OrderSummary 
            cartTotal={cartTotal} 
            shippingFee={shippingFee} 
            loyaltyDiscount={loyaltyDiscount} 
            finalTotal={finalTotal} 
            showCheckoutBtn={true} 
            onAction={handlePayment} 
            isLoading={isLoading} 
            btnText="Complete Purchase"
          />
        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

const Input = ({ label, value, onChange }) => (
  <div>
    <label className="text-[9px] font-black uppercase text-gray-400 ml-1 mb-2 block">{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-50 border-none px-6 py-4 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#E14D2A] outline-none transition-all"
      placeholder={`Enter ${label.toLowerCase()}...`}
    />
  </div>
);

const PaymentOption = ({ id, active, setter, title, sub, icon }) => (
  <div 
    onClick={() => setter(id)} 
    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${
      active === id ? 'border-[#E14D2A] bg-[#E14D2A]/5' : 'border-gray-100 bg-gray-50 hover:border-gray-200'
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
        active === id ? 'border-[#E14D2A]' : 'border-gray-300'
      }`}>
        {active === id && <div className="w-2.5 h-2.5 bg-[#E14D2A] rounded-full" />}
      </div>
      <div>
        <p className="text-xs font-black uppercase text-[#3C486B]">{title}</p>
        <p className="text-[10px] text-gray-400 italic font-medium">{sub}</p>
      </div>
    </div>
    <div className={`transition-transform duration-300 ${active === id ? 'scale-110 text-[#E14D2A]' : 'text-gray-300'}`}>
      {icon}
    </div>
  </div>
);