import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { UserContext } from './UserContext'; 

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user, isLoggedIn, apiClient } = useContext(UserContext);
    
    // --- 1. STATE MANAGEMENT ---
    const [currentCartId, setCurrentCartId] = useState(() => {
        const saved = localStorage.getItem('active_cart_id');
        return (saved && saved !== 'null' && saved !== 'undefined') ? saved : null;
    });
        
    const [cartItems, setCartItems] = useState([]);
    const [loadingCart, setLoadingCart] = useState(true);
    const [isRosterOpen, setIsRosterOpen] = useState(false);

    // --- 2. PERSISTENCE ---
    useEffect(() => {
        if (currentCartId) {
            localStorage.setItem('active_cart_id', currentCartId);
        } else {
            localStorage.removeItem('active_cart_id');
        }
    }, [currentCartId]);

    const updateLocalCart = useCallback((items) => {
        localStorage.setItem('glow_cart', JSON.stringify(items));
        setCartItems(items);
    }, []);

    // --- 3. BACKEND SYNC ---
    const syncCartWithBackend = useCallback(async () => {
        if (!apiClient || !isLoggedIn) {
            const local = JSON.parse(localStorage.getItem('glow_cart') || '[]');
            setCartItems(local);
            setLoadingCart(false);
            return;
        }

        setLoadingCart(true);
        try {
            // GET /api/cart/my_cart/
            const res = await apiClient.get('api/cart/my_cart/'); 
            if (res.data?.id) {
                setCurrentCartId(res.data.id);
                setCartItems(res.data.items || []);
            }
        } catch (error) {
            console.error("Cart sync failed:", error);
            if (error.response?.status === 404) setCurrentCartId(null);
        } finally {
            setLoadingCart(false);
        }
    }, [isLoggedIn, apiClient]);

    // --- 4. GHOST CART CLEANUP ---
    const cleanupGhostCart = useCallback(async () => {
        if (!apiClient || !isLoggedIn) return;
        
        const pendingCartId = localStorage.getItem('active_cart_id');
        if (pendingCartId && pendingCartId !== 'null') {
            try {
                // GET api/payment/{id}/check-status/
                const res = await apiClient.get(`api/payment/${pendingCartId}/check-status/`);
                if (res.data.is_converted || res.data.status === 'completed') {
                    localStorage.removeItem('active_cart_id');
                    setCurrentCartId(null);
                    await syncCartWithBackend();
                }
            } catch (err) {
                if (err.response?.status === 404) {
                    localStorage.removeItem('active_cart_id');
                    setCurrentCartId(null);
                }
            }
        }
    }, [isLoggedIn, apiClient, syncCartWithBackend]);

    useEffect(() => { 
        if (isLoggedIn) {
            syncCartWithBackend(); 
            cleanupGhostCart();
        }
    }, [isLoggedIn, syncCartWithBackend, cleanupGhostCart]);

    // --- 5. CHECKOUT LOGIC ---
    const checkout = async (gateway = 'stripe') => {
        if (!isLoggedIn) {
            alert("Please sign in to complete your purchase.");
            return;
        }

        try {
            const endpoint = gateway === 'stripe' 
                ? 'api/payment/create-checkout-session/' 
                : 'api/payment/process-esewa/';
                
            const res = await apiClient.post(endpoint);

            if (gateway === 'stripe' && res.data.url) {
                window.location.href = res.data.url; 
            } else if (gateway === 'esewa') {
                const form = document.createElement('form');
                form.setAttribute('method', 'POST');
                form.setAttribute('action', res.data.esewa_url);

                Object.keys(res.data).forEach(key => {
                    if (key !== 'esewa_url') {
                        const input = document.createElement('input');
                        input.setAttribute('type', 'hidden');
                        input.setAttribute('name', key);
                        input.setAttribute('value', res.data[key]);
                        form.appendChild(input);
                    }
                });

                document.body.appendChild(form);
                form.submit();
            }
        } catch (error) {
            console.error("Checkout failed:", error);
            alert(error.response?.data?.error || "Could not initiate payment.");
        }
    };

    // --- 6. CORE ACTIONS ---
    const addToCart = async (productSkuOrId, qty, customName = '', customNumber = '') => {
        const isObject = typeof productSkuOrId === 'object' && productSkuOrId !== null;
        const skuData = isObject ? productSkuOrId : { id: productSkuOrId };
        const skuId = skuData.id;
        
        // Stock Validation
        if (qty > 0 && skuData.stock_quantity !== undefined) {
            const existingItem = cartItems.find(i => i.sku.id === skuId);
            const currentQtyInCart = existingItem ? existingItem.quantity : 0;
            if (currentQtyInCart + qty > skuData.stock_quantity) {
                alert(`Only ${skuData.stock_quantity} units available.`);
                return;
            }
        }

        const name = customName.trim().toUpperCase();
        const number = customNumber.toString().trim();

        if (!isLoggedIn) {
            setCartItems(prev => {
                let updated = [...prev];
                const idx = updated.findIndex(i => 
                    i.sku.id === skuId && i.custom_name === name && i.custom_number === number
                );
                
                if (idx > -1) {
                    updated[idx].quantity += qty;
                    if (updated[idx].quantity <= 0) updated.splice(idx, 1);
                } else if (qty > 0) {
                    updated.push({ 
                        id: `guest-${Date.now()}`, 
                        sku: isObject ? productSkuOrId : { id: skuId, price: 0 }, 
                        quantity: qty, 
                        custom_name: name, 
                        custom_number: number 
                    });
                }
                updateLocalCart(updated);
                return updated;
            });
        } else {
            try {
                // POST api/cart/add_item/
                await apiClient.post(`api/cart/add_item/`, { 
                    sku_id: skuId, 
                    quantity: qty, 
                    custom_name: name, 
                    custom_number: number 
                });
                await syncCartWithBackend();
            } catch (e) { 
                alert("Could not update cart."); 
            }
        }
        if (qty > 0) setIsRosterOpen(true);
    };

    const removeFromCart = async (cartItemId) => {
        if (!isLoggedIn) {
            const updated = cartItems.filter(item => item.id !== cartItemId);
            updateLocalCart(updated);
        } else {
            try {
                // MATCHES router.register(r'cart_items', CartItemViewSet)
                // DELETE api/cart_items/{id}/
                await apiClient.delete(`api/cart_items/${cartItemId}/`);
                await syncCartWithBackend();
            } catch (e) { 
                console.error("Remove failed:", e.response?.data || e.message); 
            }
        }
    };

    const clearCart = useCallback(() => {
        setCartItems([]);
        setCurrentCartId(null);
        localStorage.removeItem('glow_cart');
        localStorage.removeItem('active_cart_id');
    }, []);

    // --- 7. CALCULATIONS ---
    const cartTotal = cartItems.reduce((acc, i) => {
        const itemPrice = Number(i.sku?.price || 0);
        const qty = Number(i.quantity || 0);
        const hasPrinting = (i.custom_name?.length > 0 || i.custom_number?.length > 0);
        const printingCost = hasPrinting ? (Number(i.sku?.custom_printing_cost || 15) * qty) : 0;
        return acc + (itemPrice * qty) + printingCost;
    }, 0);

    const shippingFee = cartTotal > 150 || cartTotal === 0 ? 0 : 10; 
    const loyaltyDiscount = user?.profile?.tier === 'Gold' ? cartTotal * 0.1 : 0;
    const finalTotal = Math.max(0, cartTotal - loyaltyDiscount + shippingFee);

    return (
        <CartContext.Provider value={{ 
            cart: cartItems, 
            addToCart, 
            removeFromCart, 
            clearCart,
            checkout, 
            cartTotal, 
            shippingFee, 
            loyaltyDiscount,
            finalTotal, 
            isRosterOpen, 
            setIsRosterOpen, 
            loadingCart,
            currentCartId,
            syncCartWithBackend,
            cleanupGhostCart 
        }}>
            {children}
        </CartContext.Provider>
    );
};