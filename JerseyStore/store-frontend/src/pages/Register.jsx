import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Loader2, AlertTriangle } from 'lucide-react';
import SocialAuthButtons from '../components/SocialAuthButtons';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null); // Changed initial state to null
    const [isLoading, setIsLoading] = useState(false); // New loading state
    
    // Get the register function from context
    const { register } = useContext(UserContext); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); 

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        
        try {
            // Djoser requires 'email' and 'password'
            await register(email, password); 
            
            // Success: Registration finished. Navigate to login.
            navigate('/login?message=registration_success'); 
            
        } catch (err) {
            // Handle specific Djoser/API errors
            let errorMessage = "An unknown error occurred during registration.";
            const errorData = err.response?.data || err; // Assuming API client wraps Djoser errors
            
            if (errorData.email) {
                errorMessage = `Email: ${errorData.email[0]}`;
            } else if (errorData.password) {
                errorMessage = `Password: ${errorData.password[0]}`;
            } else if (errorData.detail) {
                errorMessage = errorData.detail;
            } else if (errorData.non_field_errors) {
                 errorMessage = errorData.non_field_errors[0];
            }
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50">
            <div className="bg-white p-12 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-10">
                    <h2 className="font-serif text-3xl text-gray-800 uppercase tracking-widest">Create Account</h2>
                    <p className="text-xs text-gray-400 mt-2">Join the squad and gear up for exclusive perks!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* --- Error Display --- */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-start gap-3">
                            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0"/>
                            <p className="font-medium">{error}</p>
                        </div>
                    )}
                    
                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-2">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full bg-gray-50 rounded-xl px-6 py-4 outline-none shadow-inner focus:ring-2 focus:ring-[#f3a5b5] transition-all"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    
                    {/* Password Input */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-2">Password</label>
                        <input 
                            type="password" 
                            className="w-full bg-gray-50 rounded-xl px-6 py-4 outline-none shadow-inner focus:ring-2 focus:ring-[#f3a5b5] transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    
                    {/* Confirm Password Input */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-2">Confirm Password</label>
                        <input 
                            type="password" 
                            className="w-full bg-gray-50 rounded-xl px-6 py-4 outline-none shadow-inner focus:ring-2 focus:ring-[#f3a5b5] transition-all"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    
                    {/* --- Submit Button --- */}
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#f3a5b5] text-white py-5 rounded-xl uppercase text-[10px] font-black tracking-[0.3em] shadow-lg hover:bg-[#e894a4] hover:shadow-2xl transition-all disabled:bg-gray-300 flex items-center justify-center gap-3"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Registering...
                            </>
                        ) : (
                            <>
                                <UserPlus size={16} /> Register
                            </>
                        )}
                    </button>
                </form>
                
                {/* --- Social Login Section --- */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <SocialAuthButtons disabled={isLoading} /> 
                </div>
            </div>
        </div>
    );
}