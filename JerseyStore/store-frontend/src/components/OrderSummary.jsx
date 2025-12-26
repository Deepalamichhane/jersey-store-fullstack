import React from 'react';
import { ShieldCheck, Truck } from 'lucide-react';

export default function OrderSummary({ cartTotal, loyaltyDiscount, finalTotal, showCheckoutBtn, onAction, isLoading }) {
  // Define shipping logic in one place
  const shippingFee = finalTotal > 150 ? 0 : 10;
  const grandTotal = finalTotal + shippingFee;

  return (
    <div className="bg-[#1A1A1A] text-white p-10 rounded-[3rem] shadow-2xl sticky top-8 border border-white/5">
      <h2 className="text-2xl font-anton text-white mb-8 uppercase italic">Final Whistle</h2>
      
      <div className="space-y-5 mb-10">
        <div className="flex justify-between text-gray-400 text-xs font-black uppercase tracking-widest">
          <span>Bag Subtotal</span>
          <span className="text-white">${cartTotal.toFixed(2)}</span>
        </div>
        
        {loyaltyDiscount > 0 && (
          <div className="flex justify-between text-xs font-black uppercase tracking-widest text-jersey-pink">
            <span>Loyalty Discount</span>
            <span>-${loyaltyDiscount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-xs font-black uppercase tracking-widest">
          <span>Shipping</span>
          <span className={shippingFee === 0 ? "text-green-400" : "text-white"}>
            {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
          </span>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex justify-between items-end">
          <div>
            <p className="text-[10px] uppercase font-black text-gray-500 tracking-[0.2em] mb-2">Total Amount</p>
            <p className="text-5xl font-anton text-jersey-pink leading-none italic">
              ${grandTotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {showCheckoutBtn && (
        <button 
          onClick={onAction}
          disabled={isLoading}
          className="w-full bg-jersey-pink py-6 rounded-2xl font-anton italic text-xl uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:text-pitch-black transition-all active:scale-95"
        >
          {isLoading ? "Processing..." : <>Confirm & Pay <ShieldCheck /></>}
        </button>
      )}
      
      <div className="mt-6 flex items-center gap-2 justify-center text-[9px] text-gray-500 uppercase font-bold">
        <Truck size={12} /> {shippingFee === 0 ? "Complimentary Express Delivery" : "Standard Pitch-Side Delivery"}
      </div>
    </div>
  );
}