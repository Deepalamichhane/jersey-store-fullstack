import React, { useEffect, useContext, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { CartContext } from '../context/CartContext'; 
import { Loader2, Trophy, ArrowRight, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Success() {
    const { apiClient, user, fetchUserProfile } = useContext(UserContext);
    const { syncCartWithBackend, clearCart } = useContext(CartContext);
    const [searchParams, setSearchParams] = useSearchParams(); // Added setSearchParams
    const navigate = useNavigate();

    const [isVerifying, setIsVerifying] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    const [statusMsg, setStatusMsg] = useState('Verifying your lineup...');
    const [orderData, setOrderData] = useState(null);
    const verificationStarted = useRef(false);

    useEffect(() => {
        const finalizeOrder = async () => {
            // Prevent double execution in React Strict Mode
            if (verificationStarted.current) return;
            verificationStarted.current = true;

            const sessionId = searchParams.get('session_id'); // Stripe
            const esewaData = searchParams.get('data');      // eSewa
            const cartId = localStorage.getItem('active_cart_id');
            const isInstant = searchParams.get('is_instant') === 'true';

            // Guard: Check if we have the necessary identifiers
            if ((!isInstant && !cartId) || (!sessionId && !esewaData)) {
                setStatusMsg('Session data missing or expired.');
                setIsVerifying(false);
                return;
            }

            try {
                let response;
                const payload = { 
                    cart_id: cartId, 
                    is_instant: isInstant 
                };

                // Routing to the correct verification endpoint based on provider
                if (esewaData) {
                    response = await apiClient.post('/api/payments/verify-esewa/', { 
                        ...payload, 
                        data: esewaData 
                    });
                } else {
                    response = await apiClient.post('/api/payments/verify-payment/', { 
                        ...payload, 
                        session_id: sessionId 
                    });
                }

                if (response.status === 200 || response.status === 201) {
                    setOrderData(response.data);
                    setIsSuccess(true);
                    
                    // Cleanup: Clear URL parameters to prevent accidental re-verification on refresh
                    setSearchParams({}); 

                    // Logic: Only clear locker if it was a standard checkout
                    if (!isInstant) {
                        clearCart(); // Wipes local storage & context
                        await syncCartWithBackend(); // Pulls the new empty state
                    }
                    
                    const token = localStorage.getItem('access_token');
                    if (token) fetchUserProfile(token);
                    
                    confetti({ 
                        particleCount: 150, 
                        spread: 70, 
                        origin: { y: 0.6 },
                        colors: ['#3C486B', '#E14D2A', '#FEE440']
                    });
                }
            } catch (error) {
                console.error("Verification Error:", error);
                const backendError = error.response?.data?.error || error.response?.data?.message;
                setStatusMsg(backendError || "Order verification failed. Please contact support.");
                setIsSuccess(false);
            } finally {
                setIsVerifying(false);
            }
        };

        // Ensure user context is loaded before verifying
        if (user) {
            finalizeOrder();
        }
    }, [user, searchParams, apiClient, clearCart, fetchUserProfile, syncCartWithBackend, setSearchParams]);

    // ... (UI RENDERING remains the same as your provided code)
    if (isVerifying) {
        return (
            <div className="h-screen flex flex-col items-center justify-center font-anton uppercase italic text-[#3C486B]">
                <Loader2 className="animate-spin mb-4" size={48} />
                <span>{statusMsg}</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border border-gray-100">
                {isSuccess ? (
                    <>
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trophy className="text-green-600" size={40} />
                        </div>
                        <h1 className="font-anton text-4xl uppercase italic text-[#3C486B] mb-2">Order Secured!</h1>
                        <p className="text-gray-500 font-medium mb-8 uppercase text-xs tracking-widest">
                            Order ID: #{orderData?.order_id || 'N/A'}
                        </p>
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="w-full py-4 bg-[#3C486B] text-white rounded-2xl font-anton italic uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all"
                        >
                            View My Locker <ArrowRight size={18} />
                        </button>
                    </>
                ) : (
                    <>
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="text-red-600" size={40} />
                        </div>
                        <h1 className="font-anton text-4xl uppercase italic text-red-600 mb-2">Review Refused</h1>
                        <p className="text-gray-500 font-medium mb-8 uppercase text-xs tracking-widest leading-relaxed">
                            {statusMsg}
                        </p>
                        <button 
                            onClick={() => navigate('/cart')}
                            className="w-full py-4 bg-gray-100 text-[#3C486B] rounded-2xl font-anton italic uppercase tracking-widest hover:bg-gray-200 transition-all"
                        >
                            Back to Checkout
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}