import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, Loader2, AlertTriangle } from 'lucide-react';
import SocialAuthButtons from '../components/SocialAuthButtons'; // Assumed component for Google/Facebook buttons

export default function Login() {
    // --- Context Hooks ---
    // Destructure login function and global loading/user state
    const { login, loading: userLoading, user } = useContext(UserContext);
    const navigate = useNavigate();

    // --- Local State ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false); // For local form submission state
    const [error, setError] = useState(null); // For displaying API errors

    // --- Effect for Post-Login Navigation ---
    useEffect(() => {
        // If user is loaded and not currently loading their profile data, navigate away
        if (user && !userLoading) {
            // Use a dashboard or profile route
            navigate('/dashboard', { replace: true }); 
        }
    }, [user, userLoading, navigate]);


    // --- Submission Handler ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // The login function in UserContext returns the token/success
            await login(email, password); 
            
            // If login succeeds, useEffect will handle navigation once user profile is fetched
            // We keep isLoading true until useEffect redirects or an error occurs.
            
        } catch (err) {
            // Handle specific Djoser/API errors
            const apiError = err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || "Invalid email or password.";
            setError(apiError);
            setIsLoading(false);
        }
    };
    
    // Determine overall button state
    const isSubmitting = isLoading || userLoading;

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50">
            <div className="bg-white p-12 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-10">
                    <h2 className="font-serif text-3xl text-gray-800 uppercase tracking-widest">Welcome Back</h2>
                    <p className="text-xs text-gray-400 mt-2">Enter your details to access your account.</p>
                </div>
                
                {/* --- Error Display --- */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
                        <AlertTriangle size={16}/>
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-2">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full bg-gray-50 rounded-xl px-6 py-4 outline-none shadow-inner focus:ring-2 focus:ring-[#f3a5b5] transition-all"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-2">Password</label>
                        <input 
                            type="password" 
                            className="w-full bg-gray-50 rounded-xl px-6 py-4 outline-none shadow-inner focus:ring-2 focus:ring-[#f3a5b5] transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    
                    {/* --- Submit Button --- */}
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#f3a5b5] text-white py-5 rounded-xl uppercase text-[10px] font-black tracking-[0.3em] shadow-lg hover:bg-black hover:shadow-2xl transition-all disabled:bg-gray-300 flex items-center justify-center gap-3"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Signing In...
                            </>
                        ) : (
                            <>
                                <LogIn size={16} /> Sign In
                            </>
                        )}
                    </button>
                    
                    {/* --- Forgot Password Link --- */}
                    <div className="text-center pt-2">
                        <button 
                            onClick={() => console.log('Navigate to forgot password')}
                            className="text-xs text-gray-400 hover:text-[#f3a5b5] transition-colors font-medium"
                            type="button"
                        >
                            Forgot Password?
                        </button>
                    </div>
                </form>
                
                {/* --- Social Login Section --- */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <SocialAuthButtons disabled={isSubmitting}/>
                </div>
            </div>
        </div>
    );
}