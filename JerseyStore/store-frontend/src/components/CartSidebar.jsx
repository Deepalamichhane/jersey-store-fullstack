import React, { useContext, useState } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { UserContext } from '../context/UserContext'; 
import AuthModal from './Authmodal'; 

const BASE_URL = 'http://127.0.0.1:8000'; 

export default function CartSidebar() {
  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    finalTotal, 
    isRosterOpen, 
    setIsRosterOpen, 
    loadingCart 
  } = useContext(CartContext);
  
  const { isLoggedIn } = useContext(UserContext);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Helper to calculate individual line item totals (Price + Customization)
  const getLineItemTotal = (item) => {
    const base = Number(item.sku?.price || 0);
    const hasPrinting = (item.custom_name?.trim() || item.custom_number?.trim());
    
    // CONSISTENCY UPDATE: Fallback to $15.00 to match ProductDetail and Context
    const printing = hasPrinting ? Number(item.sku?.custom_printing_cost || 15) : 0;
    
    return (base + printing) * item.quantity;
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
    } else {
      setIsRosterOpen(false);
      window.location.href = '/checkout';
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] transition-opacity duration-500 ${
          isRosterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={() => setIsRosterOpen(false)}
      />

      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-[1000] shadow-2xl transition-transform duration-500 ease-in-out ${
        isRosterOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          
          <div className="p-6 border-b flex justify-between items-center bg-[#3C486B] text-white">
            <h2 className="font-anton text-2xl uppercase italic tracking-wider">Your Roster</h2>
            <X 
              className="cursor-pointer hover:rotate-90 transition-transform duration-300" 
              onClick={() => setIsRosterOpen(false)} 
            />
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-gray-50/50">
            {loadingCart ? (
              <div className="flex justify-center mt-10 text-[10px] font-black uppercase tracking-widest animate-pulse text-[#3C486B]">
                Syncing Locker...
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center mt-20 opacity-10 font-anton text-6xl uppercase italic leading-none select-none">
                Locker<br/>Empty
              </div>
            ) : (
              cart.map((item, index) => {
                const imgSource = item.sku?.image?.startsWith('http') 
                  ? item.sku.image 
                  : `${BASE_URL}${item.sku.image}`;

                return (
                  <div 
                    key={item.id} 
                    className="flex gap-4 mb-6 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm animate-fadeIn" 
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="w-20 h-24 bg-gray-100 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                      <img src={imgSource} className="w-full h-full object-contain" alt={item.sku?.product_name} />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-[11px] font-black text-[#3C486B] uppercase leading-tight pr-4">
                            {item.sku?.product_name}
                          </h4>
                          <button onClick={() => removeFromCart(item.id)}>
                            <Trash2 size={14} className="text-gray-300 hover:text-red-500 transition-colors" />
                          </button>
                        </div>
                        
                        <div className="flex gap-2 mt-1">
                          <span className="text-[9px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded uppercase">
                            Size: {item.sku?.size}
                          </span>
                          {(item.custom_name || item.custom_number) && (
                            <span className="text-[9px] font-black px-2 py-0.5 bg-pink-50 text-pink-500 rounded uppercase tracking-tighter">
                              Official Print
                            </span>
                          )}
                        </div>
                        
                        {(item.custom_name || item.custom_number) && (
                          <p className="text-[10px] text-[#3C486B] font-anton italic mt-2 uppercase tracking-wide">
                            {item.custom_name} <span className="text-pink-500">#{item.custom_number}</span>
                          </p>
                        )}
                      </div>

                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-white shadow-inner">
                          <button 
                            onClick={() => addToCart(item.sku, -1, item.custom_name, item.custom_number)} 
                            className="p-1.5 hover:bg-gray-50 text-[#3C486B]"
                          >
                            <Minus size={12}/>
                          </button>
                          <span className="text-xs px-2 font-black text-[#3C486B]">{item.quantity}</span>
                          <button 
                            onClick={() => addToCart(item.sku, 1, item.custom_name, item.custom_number)} 
                            className="p-1.5 hover:bg-gray-50 text-[#3C486B]"
                          >
                            <Plus size={12}/>
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-anton italic text-[#3C486B]">
                            ${getLineItemTotal(item).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-8 border-t bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.05)] space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    <span>Squad Subtotal</span>
                    <span className="text-[#3C486B]">${finalTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase text-gray-400 font-black tracking-widest">Est. Total</span>
                    <span className="text-4xl font-anton italic text-[#3C486B] leading-none">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-3 py-5 bg-[#3C486B] text-white text-xs font-anton italic uppercase tracking-[0.2em] hover:bg-pink-600 transition-all rounded-2xl shadow-xl shadow-blue-900/10 active:scale-[0.98]"
                >
                  Advance to Checkout <ArrowRight size={16} />
                </button>
            </div>
          )}
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}