import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { X, Trash2, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function MatchDayRoster() {
  const { cart, removeFromCart, finalTotal, isRosterOpen, setIsRosterOpen, cartTotal, shippingFee } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isRosterOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 z-[9999] bg-white flex flex-col"
        >
          {/* Top Bar */}
          <div className="flex justify-between items-center px-8 py-8 md:px-16 border-b border-gray-50">
            <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-jersey-pink rounded-full animate-pulse" />
                <h2 className="font-anton text-2xl md:text-4xl italic uppercase tracking-tighter text-[#3C486B]">Match Day Roster</h2>
            </div>
            <button 
              onClick={() => setIsRosterOpen(false)}
              className="group flex items-center gap-4 font-black text-[10px] uppercase tracking-[0.3em] text-[#3C486B]"
            >
              Close Locker 
              <span className="p-4 bg-[#3C486B] text-white rounded-full group-hover:bg-jersey-pink transition-all">
                <X size={20}/>
              </span>
            </button>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            {/* Left Side: Scrollable Items */}
            <div className="lg:col-span-8 overflow-y-auto px-8 md:px-16 py-12 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col justify-center">
                    <h3 className="font-anton text-7xl md:text-9xl text-gray-100 uppercase italic leading-none">Empty<br/>Locker</h3>
                    <button onClick={() => setIsRosterOpen(false)} className="mt-8 text-sm font-black uppercase tracking-widest text-jersey-pink flex items-center gap-2">
                        <ArrowRight size={16} /> Return to Scouting
                    </button>
                </div>
              ) : (
                <div className="space-y-16 pb-20">
                  {cart.map((item, idx) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex flex-col md:flex-row gap-10 items-center md:items-start group"
                    >
                      <div className="font-anton text-5xl text-gray-100 italic">0{idx + 1}</div>
                      <div className="w-48 h-60 bg-gray-50 rounded-[2.5rem] flex-shrink-0 p-6 flex items-center justify-center border border-gray-100 group-hover:border-jersey-pink transition-colors">
                        <img src={item.sku.image} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h4 className="font-anton text-4xl md:text-5xl uppercase italic text-[#3C486B] leading-none mb-3">{item.sku.product_name}</h4>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                            <span className="px-4 py-1 bg-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest">Size: {item.sku.size}</span>
                            <span className="px-4 py-1 bg-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest">Qty: {item.quantity}</span>
                        </div>
                        {item.custom_name && (
                          <div className="inline-flex items-center gap-3 border-2 border-[#3C486B] px-6 py-2 rounded-xl mb-4">
                            <span className="font-anton text-xl italic uppercase text-[#3C486B]">{item.custom_name}</span>
                            <span className="w-px h-4 bg-gray-300"/>
                            <span className="font-anton text-xl italic uppercase text-[#3C486B]">{item.custom_number}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-center md:items-end justify-between self-stretch py-2">
                        <div className="font-anton text-3xl text-[#3C486B]">${(item.sku.price * item.quantity).toFixed(2)}</div>
                        <button 
                          onClick={() => removeFromCart(item.id, item.sku.id)}
                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={14} /> Release Item
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side: Sticky Summary */}
            <div className="lg:col-span-4 bg-[#F9FAFB] border-l border-gray-100 p-8 md:p-16 flex flex-col">
              <div className="flex-1 space-y-12">
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        <span>Locker Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        <span>Match Logistics</span>
                        <span className="text-pitch-black">{shippingFee === 0 ? 'Complimentary' : `$${shippingFee.toFixed(2)}`}</span>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Final Valuation</p>
                    <div className="font-anton text-8xl md:text-[10rem] italic text-[#3C486B] leading-[0.8] tracking-tighter">
                        ${finalTotal.toFixed(0)}<span className="text-3xl align-top">.{ (finalTotal % 1).toFixed(2).split('.')[1] }</span>
                    </div>
                </div>
              </div>

              <div className="mt-12 space-y-6">
                <div className="flex items-center gap-3 text-[#3C486B]/60">
                    <ShieldCheck size={18} />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Official Authenticity Guaranteed</span>
                </div>
                <button 
                  disabled={cart.length === 0}
                  onClick={() => { setIsRosterOpen(false); navigate('/checkout'); }}
                  className="w-full py-8 bg-[#3C486B] text-white rounded-full font-anton text-3xl italic uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-jersey-pink transition-all group disabled:bg-gray-200"
                >
                  Confirm Lineup <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform"/>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}