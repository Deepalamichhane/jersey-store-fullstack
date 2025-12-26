import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { 
    ArrowLeft, 
    Package, 
    Truck, 
    CreditCard, 
    Hash, 
    User as UserIcon, 
    Loader2, 
    ExternalLink,
    Clock
} from 'lucide-react';

export default function OrderDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { apiClient } = useContext(UserContext);
    
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const res = await apiClient.get(`api/orders/${id}/`);
                setOrder(res.data);
            } catch (err) {
                console.error("Error fetching order:", err);
                setError("Could not find this order. It may have been archived or is temporarily unavailable.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [id, apiClient]);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-[#f3a5b5]" size={40} />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Retrieving Order Manifest...</p>
        </div>
    );

    if (error || !order) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-red-50 p-4 rounded-full mb-6">
                <Package className="text-red-400" size={32} />
            </div>
            <p className="text-gray-500 mb-6 max-w-xs">{error}</p>
            <button 
                onClick={() => navigate('/orders')} 
                className="px-8 py-3 bg-black text-white font-black uppercase text-[10px] tracking-widest rounded-full hover:bg-[#f3a5b5] transition-colors"
            >
                Back to Order History
            </button>
        </div>
    );

    // Dynamic color helper for status badges
    const getStatusColor = (status) => {
        const s = status?.toLowerCase();
        if (s.includes('deliver')) return 'text-green-500';
        if (s.includes('ship')) return 'text-blue-500';
        if (s.includes('process')) return 'text-orange-500';
        return 'text-[#f3a5b5]';
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 bg-white min-h-screen">
            {/* Navigation Header */}
            <button 
                onClick={() => navigate('/orders')}
                className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-12 group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Back to Dashboard</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                
                {/* Main Content: Items List */}
                <div className="lg:col-span-2 space-y-10">
                    <header className="border-b border-gray-100 pb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-anton italic uppercase tracking-tighter text-gray-900 leading-none">
                                Order #ARENA-{order.id}
                            </h1>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                           <div className="flex items-center gap-1.5">
                               <Clock size={12} />
                               {new Date(order.created_at).toLocaleDateString('en-US', { dateStyle: 'long' })}
                           </div>
                           <div className="w-1 h-1 bg-gray-200 rounded-full" />
                           <span>Stripe Ref: {order.payment_intent_id?.slice(-8) || 'N/A'}</span>
                        </div>
                    </header>

                    <div className="space-y-6">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Locker Contents ({order.items.length})</h2>
                        {order.items.map((item) => (
                            <div key={item.id} className="group flex flex-col sm:flex-row gap-6 p-6 rounded-[2rem] border border-gray-100 bg-white hover:border-[#f3a5b5]/30 transition-all shadow-sm hover:shadow-md">
                                {/* Product Image */}
                                <div className="w-full sm:w-28 h-36 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 relative border border-gray-50">
                                    <img 
                                        src={item.product_image || '/placeholder-jersey.png'} 
                                        alt={item.product_name} 
                                        className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-2 left-2 bg-black text-white text-[8px] px-2 py-1 rounded-full font-black uppercase">
                                        QTY {item.quantity}
                                    </div>
                                </div>

                                <div className="flex-grow flex flex-col justify-between py-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-anton italic text-xl text-gray-800 uppercase leading-none mb-1 group-hover:text-[#f3a5b5] transition-colors">{item.product_name}</h3>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fit: {item.sku_name}</p>
                                        </div>
                                        <p className="font-anton italic text-lg text-gray-800">${parseFloat(item.price_at_purchase).toFixed(2)}</p>
                                    </div>

                                    {/* Customization Details */}
                                    {(item.custom_name || item.custom_number) && (
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {item.custom_name && (
                                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                                    <UserIcon size={10} className="text-[#f3a5b5]" />
                                                    <span className="text-[9px] font-black uppercase tracking-wider text-gray-600">{item.custom_name}</span>
                                                </div>
                                            )}
                                            {item.custom_number && (
                                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                                    <Hash size={10} className="text-[#f3a5b5]" />
                                                    <span className="text-[9px] font-black uppercase tracking-wider text-gray-600">{item.custom_number}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar: Order Summary & Logistics */}
                <div className="space-y-8">
                    {/* Status Card */}
                    <div className="p-8 rounded-[2.5rem] bg-gray-900 text-white shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                                    <Truck size={24} className="text-[#f3a5b5]" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Order Progress</p>
                                    <p className={`text-2xl font-anton italic uppercase tracking-tighter ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <button className="w-full bg-white text-black hover:bg-[#f3a5b5] hover:text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">
                                    Track Kit <ExternalLink size={14} />
                                </button>
                                <button className="w-full bg-white/5 hover:bg-white/10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all text-gray-400">
                                    Download Invoice
                                </button>
                            </div>
                        </div>
                        {/* Decorative Background Element */}
                        <div className="absolute -right-4 -bottom-4 text-white/5 font-anton italic text-8xl rotate-12 pointer-events-none select-none">
                            ARENA
                        </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="p-8 rounded-[2.5rem] border border-gray-100 bg-gray-50/50">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2">
                            <CreditCard size={12} /> Financial Ledger
                        </h3>
                        <div className="space-y-5 text-[11px] font-bold uppercase tracking-widest">
                            <div className="flex justify-between text-gray-500">
                                <span>Locker Subtotal</span>
                                <span>${(order.subtotal || (parseFloat(order.total_amount) - 15)).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Express Shipping</span>
                                <span>$15.00</span>
                            </div>
                            <div className="pt-5 border-t border-gray-200 flex justify-between font-anton italic text-2xl text-gray-900 tracking-tighter">
                                <span className="uppercase">Final</span>
                                <span>${parseFloat(order.total_amount).toFixed(2)}</span>
                            </div>
                        </div>
                        
                        <div className="mt-8 flex items-center justify-center gap-2 opacity-50">
                            <div className="h-px bg-gray-300 flex-grow" />
                            <p className="text-[8px] text-gray-400 uppercase font-black tracking-tighter whitespace-nowrap">
                                Encrypted via Stripe
                            </p>
                            <div className="h-px bg-gray-300 flex-grow" />
                        </div>
                    </div>

                    {/* Support Help */}
                    <div className="px-6 py-4 bg-pink-50/30 rounded-2xl text-center border border-pink-100/50">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-tight mb-2">Issue with the printing or fit?</p>
                        <button className="text-[10px] font-black uppercase tracking-[0.1em] text-[#f3a5b5] hover:text-black transition-colors">
                            Speak with Kit Manager
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}