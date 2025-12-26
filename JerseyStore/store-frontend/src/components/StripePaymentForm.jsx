import React, { useState, useContext } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { CreditCard, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            fontSize: '16px',
            color: '#3C486B', // Navy from your theme
            fontFamily: 'Inter, sans-serif',
            '::placeholder': { color: '#aab7c4' },
            padding: '10px 12px',
        },
        invalid: { color: '#fa755a', iconColor: '#fa755a' },
    },
};

export default function StripePaymentForm({ totalAmount }) {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { apiClient, token } = useContext(UserContext);
    
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ message: '', type: '' });

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements || !token) return;

        setLoading(true);
        setStatus({ message: '', type: '' });

        try {
            // 1. Create Payment Intent on Django
            // We pass the active_cart_id so the backend knows which items are being bought
            const cartId = localStorage.getItem('active_cart_id');
            const response = await apiClient.post('api/payments/create-payment-intent/', {
                amount: totalAmount, 
                cart_id: cartId
            });
            
            const { client_secret, session_id } = response.data;

            // 2. Confirm Card Payment
            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: { name: 'Jersey Arena Fan' },
                },
            });

            if (result.error) {
                setStatus({ message: result.error.message, type: 'error' });
            } else if (result.paymentIntent.status === 'succeeded') {
                setStatus({ message: 'Goal! Payment confirmed.', type: 'success' });
                
                // 3. Redirect to our celebration page
                // We pass the session_id in the URL so Success.jsx can verify it
                setTimeout(() => {
                    navigate(`/success?session_id=${result.paymentIntent.id}`);
                }, 1000);
            }
        } catch (error) {
            setStatus({ message: 'Stadium connection lost. Try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-jersey">
            <h3 className="font-anton italic uppercase text-xl text-[#3C486B] flex items-center gap-2">
                <CreditCard size={22} className="text-jersey-pink" /> 
                Secure Checkout
            </h3>

            {status.message && (
                <div className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center animate-in fade-in slide-in-from-top-2 ${
                    status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                    {status.type === 'success' ? <CheckCircle size={14} className="mr-2" /> : <AlertTriangle size={14} className="mr-2" />}
                    {status.message}
                </div>
            )}

            <div className="p-4 bg-stadium-gray border border-gray-200 rounded-xl focus-within:border-jersey-pink focus-within:ring-1 focus-within:ring-jersey-pink transition-all">
                <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>

            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full py-5 bg-[#3C486B] text-white font-anton italic uppercase tracking-[0.2em] rounded-xl hover:bg-jersey-pink transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center shadow-xl"
            >
                {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                ) : (
                    `Authorize $${totalAmount.toFixed(2)}`
                )}
            </button>

            <p className="text-[9px] text-center text-gray-400 uppercase font-bold tracking-tight">
                Encrypted by Stripe. No card data is stored in the arena.
            </p>
        </form>
    );
}