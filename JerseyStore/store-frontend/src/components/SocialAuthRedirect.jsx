// src/pages/SocialAuthRedirect.jsx
import React, { useEffect, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = 'http://127.0.0.1:8000'; 

export default function SocialAuthRedirect() {
    const location = useLocation();
    const navigate = useNavigate();
    const { socialLogin } = useContext(UserContext); 
    const [status, setStatus] = useState('Completing social login...');

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const code = query.get('code');
        const provider = query.get('state'); 

        if (!code || !provider) {
            setStatus('Error: Missing authentication details.');
            setTimeout(() => navigate('/login'), 3000);
            return;
        }

        const exchangeCodeForToken = async () => {
            try {
                // 1. Send the code to Djoser's token exchange endpoint
                const response = await axios.post(
                    `${BACKEND_URL}/auth/o/${provider}/`,
                    { code: code }
                );

                const newToken = response.data.access; 

                if (newToken) {
                    // 2. Use the function from UserContext to store the token and fetch user profile
                    socialLogin(newToken);
                    
                    setStatus('Success! Redirecting to dashboard...');
                    navigate('/dashboard'); 
                } else {
                    throw new Error('Access token not received from backend.');
                }
            } catch (error) {
                console.error("Social Auth Error:", error);
                setStatus('Login failed. Please try again.');
                setTimeout(() => navigate('/login'), 3000);
            }
        };

        exchangeCodeForToken();
    }, [location, navigate, socialLogin]);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50/50">
            <Loader2 size={36} className="animate-spin text-[#f3a5b5] mb-4" />
            <h2 className="text-xl font-medium text-gray-700">{status}</h2>
            <p className="text-sm text-gray-500 mt-2">Do not close this window...</p>
        </div>
    );
}