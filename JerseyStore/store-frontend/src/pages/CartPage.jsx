import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Plus, Minus, Loader2, AlertTriangle, ShoppingCart, Info } from 'lucide-react';
import RelatedProducts from '../components/RelatedProducts';

export default function CartPage() {
    const { 
        cart, 
        addToCart, 
        removeFromCart, 
        cartTotal, 
        finalTotal, 
        loyaltyDiscount,
        loadingCart,
        cartError,
    } = useContext(CartContext);

    const handleIncrement = (item) => {
        const currentStock = item.sku?.stock_quantity || 0;
        
        if (item.quantity >= currentStock) {
            // Keep the alert as a fallback for accessibility
            alert(`Maximum stock reached. Only ${currentStock} available in the locker room.`);
            return;
        }
        
        addToCart(item.sku.id || item.sku, 1, item.custom_name, item.custom_number);
    };

    const handleDecrement = (item) => {
        removeFromCart(item.id, item.sku.id || item.sku, false);
    };

    const handleRemoveItem = (item) => {
        removeFromCart(item.id, item.sku.id || item.sku, true);
    };

    if (loadingCart) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 size={36} className="animate-spin text-jersey-pink mb-4" />
                <p className="text-gray-600 font-medium tracking-widest uppercase text-[10px]">Syncing with Locker Room...</p>
            </div>
        );
    }

    if (cartError) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-6">
                <div className="bg-red-50 text-red-700 p-8 rounded-[2rem] flex items-center gap-4 border border-red-100 max-w-md">
                    <AlertTriangle size={32} className="flex-shrink-0"/> 
                    <div>
                        <p className="font-black uppercase text-xs tracking-widest mb-1">Connection Error</p>
                        <p className="text-sm opacity-80">{cartError}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!cart || cart.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-6">
                <div className="bg-stadium-gray p-12 rounded-full mb-8">
                    <ShoppingCart size={64} className="text-gray-300"/>
                </div>
                <h2 className="text-5xl font-['Anton'] uppercase italic text-pitch-black mb-4">Your Bag is Empty</h2>
                <p className="text-gray-500 mb-10 max-w-xs text-center font-medium">Your favorite kits are waiting for you to bring them home.</p>
                <Link to="/" className="bg-jersey-pink text-white px-12 py-5 rounded-full text-xs font-black tracking-[0.2em] hover:bg-pitch-black transition-all shadow-2xl uppercase">
                    Explore Collection
                </Link>
            </div>
        );
    }
    
    return (
        <div className="max-w-7xl mx-auto px-6 py-16">
            <h1 className="text-6xl font-['Anton'] text-pitch-black mb-12 uppercase italic leading-none">
                Your Bag <span className="inline-block align-middle ml-4 text-sm font-sans font-black text-white bg-jersey-pink px-4 py-1 rounded-full not-italic tracking-tighter">{cart.length}</span>
            </h1>

            <div className="flex flex-col lg:flex-row gap-16">
                {/* --- Left: Cart Items List --- */}
                <div className="flex-grow">
                    <div className="hidden md:grid grid-cols-4 pb-6 border-b border-gray-100 text-[10px] uppercase font-black tracking-[0.2em] text-gray-400">
                        <div className="col-span-2">Kit Details</div>
                        <div className="text-center">Quantity</div>
                        <div className="text-right">Total</div>
                    </div>

                    {cart.map(item => {
                        const skuData = item.sku || {};
                        const productData = skuData.product || {};
                        const hasCustomization = item.custom_name || item.custom_number;
                        const stockLeft = skuData.stock_quantity || 0;
                        const isMaxStock = item.quantity >= stockLeft;
                        
                        const basePrice = parseFloat(skuData.price || 0);
                        const printingFee = hasCustomization ? 15.00 : 0;
                        const itemTotal = (basePrice + printingFee) * item.quantity;

                        return (
                            <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 items-center gap-8 py-10 border-b border-gray-50 group">
                                
                                {/* Image and Product Info */}
                                <div className="col-span-2 flex gap-8">
                                    <div className="w-28 h-36 bg-stadium-gray rounded-[1.5rem] overflow-hidden flex-shrink-0 p-2 border border-gray-100">
                                        <img 
                                            src={skuData.image || 'placeholder.jpg'} 
                                            alt={productData.name} 
                                            className="w-full h-full object-contain" 
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h3 className="font-['Anton'] text-2xl text-pitch-black uppercase italic leading-tight mb-1">
                                            {productData.name || "Match Jersey"}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                                Size {skuData.size || 'N/A'}
                                            </span>
                                            {stockLeft < 5 && (
                                                <span className="text-[9px] font-black uppercase bg-red-100 text-red-600 px-2 py-1 rounded animate-pulse">
                                                    Only {stockLeft} Left
                                                </span>
                                            )}
                                        </div>
                                        
                                        {hasCustomization && (
                                            <div className="mt-4 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm">
                                                <p className="text-[9px] uppercase font-black text-jersey-pink mb-1 flex items-center gap-1">
                                                    <Info size={10}/> Custom Print
                                                </p>
                                                <p className="text-sm font-black text-pitch-black">
                                                    {item.custom_name || 'NO NAME'} • {item.custom_number || '00'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* UPDATED: Quantity Controls with Visual Stock Guard */}
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center bg-stadium-gray rounded-2xl p-1 border border-gray-100">
                                        <button 
                                            onClick={() => handleDecrement(item)} 
                                            className="p-3 hover:bg-white hover:shadow-md rounded-xl transition-all text-pitch-black active:scale-90"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        
                                        <span className="px-6 font-black text-sm">{item.quantity}</span>
                                        
                                        <button 
                                            onClick={() => handleIncrement(item)} 
                                            disabled={isMaxStock}
                                            className="p-3 hover:bg-white hover:shadow-md rounded-xl transition-all text-pitch-black active:scale-90 disabled:opacity-20 disabled:cursor-not-allowed group-hover:disabled:bg-transparent"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    {/* Visual Stock Feedback Label */}
                                    {isMaxStock && (
                                        <p className="text-[8px] font-black uppercase text-red-500 mt-2 tracking-tighter">
                                            Max Room Capacity Reached
                                        </p>
                                    )}

                                    <button 
                                        onClick={() => handleRemoveItem(item)}
                                        className="text-[9px] uppercase font-black tracking-widest text-gray-300 hover:text-red-500 mt-4 transition-colors underline decoration-red-100"
                                    >
                                        Remove Kit
                                    </button>
                                </div>

                                {/* Item Subtotal */}
                                <div className="text-right">
                                    <p className="font-['Anton'] text-3xl text-pitch-black italic leading-none">
                                        ${itemTotal.toFixed(2)}
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-2">
                                        ${(basePrice + printingFee).toFixed(2)} / Unit
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {/* --- Order Summary Sidebar --- */}
                <div className="w-full lg:w-[420px] flex-shrink-0">
                    <div className="bg-stadium-gray p-10 rounded-[3rem] sticky top-8 border border-gray-100 shadow-sm">
                        <h2 className="text-2xl font-['Anton'] text-pitch-black mb-8 uppercase italic">Final Whistle</h2>
                        
                        <div className="space-y-5 mb-10">
                            <div className="flex justify-between text-gray-500 text-sm font-bold uppercase tracking-tighter">
                                <span>Bag Subtotal</span>
                                <span className="text-pitch-black">${cartTotal.toFixed(2)}</span>
                            </div>
                            
                            <div className="flex justify-between text-sm font-bold uppercase tracking-tighter">
                                <span className="text-green-600">Loyalty Discount</span>
                                <span className="text-green-600">-${loyaltyDiscount.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between text-sm font-bold uppercase tracking-tighter">
                                <span>Shipping</span>
                                <span className="text-pitch-black text-[10px] bg-white px-2 py-1 rounded border border-gray-200">FREE</span>
                            </div>
                            
                            <div className="pt-8 border-t border-gray-200 flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] mb-2">Total Amount</p>
                                    <p className="text-5xl font-['Anton'] text-pitch-black leading-none italic">${finalTotal.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <Link 
                            to="/checkout" 
                            className="w-full bg-pitch-black text-white block text-center py-6 uppercase tracking-[0.2em] font-black rounded-[2rem] hover:bg-jersey-pink transition-all shadow-2xl active:scale-95"
                        >
                            Proceed to Checkout
                        </Link>
                        
                        <div className="mt-10 flex items-center justify-center gap-6 grayscale opacity-40">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-4" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Related Items Section --- */}
            <div className="mt-32">
                <div className="flex items-center gap-6 mb-12">
                    <h3 className="text-4xl font-['Anton'] uppercase italic text-pitch-black whitespace-nowrap">Complete the Look</h3>
                    <div className="h-[2px] w-full bg-gray-100"></div>
                </div>
                <RelatedProducts currentItems={cart} />
            </div>
        </div>
    );
}