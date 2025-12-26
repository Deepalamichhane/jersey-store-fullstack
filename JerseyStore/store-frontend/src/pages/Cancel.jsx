import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { XCircle, ArrowLeft, MessageCircle, ShoppingBag } from 'lucide-react';

const Cancel = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
            <div className="max-w-xl mx-auto bg-white p-12 shadow-2xl rounded-[3rem] text-center border border-gray-100">
                
                <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <XCircle size={48} className="text-red-500" />
                </div>
                
                <h1 className="font-anton text-4xl text-[#3C486B] mb-4 uppercase italic tracking-tighter">
                    Payment Cancelled
                </h1>
                
                <p className="text-gray-500 mb-10 leading-relaxed font-medium">
                    No worries! Your order hasn't been placed, and your kits are still waiting in your locker room. 
                    If you had trouble with your connection or card, feel free to try again.
                </p>

                <div className="space-y-4">
                    <button 
                        onClick={() => navigate('/checkout')}
                        className="w-full bg-[#3C486B] text-white py-5 px-6 rounded-2xl uppercase text-[10px] font-black tracking-[0.2em] hover:bg-jersey-pink transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
                    >
                        <ShoppingBag size={18} /> Return to Checkout
                    </button>

                    <Link 
                        to="/shop"
                        className="w-full bg-gray-100 text-[#3C486B] py-5 px-6 rounded-2xl uppercase text-[10px] font-black tracking-[0.2em] border border-transparent hover:border-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={14} /> Continue Browsing
                    </Link>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col items-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Having technical difficulties?</p>
                    <button 
                        onClick={() => window.location.href = 'mailto:support@yourstore.com'}
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-jersey-pink hover:text-[#3C486B] transition-colors"
                    >
                        <MessageCircle size={18} /> Chat with Support
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cancel;