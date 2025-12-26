// src/components/SocialAuthButtons.jsx
import React from 'react';
import { Mail, Facebook, AtSign } from 'lucide-react';

// NOTE: Replace YOUR_BACKEND_URL with the actual URL (e.g., http://127.0.0.1:8000)
const BACKEND_URL = 'http://127.0.0.1:8000'; 

export default function SocialAuthButtons() {

    // Function to handle the social login initiation
    const handleSocialLogin = (provider) => {
        // This URL is provided by djoser.urls.social (or djoser.social.urls)
        const socialAuthUrl = `${BACKEND_URL}/auth/o/${provider}/`;
        
        // Redirect the user to the Django endpoint
        window.location.href = socialAuthUrl;
    };

    return (
        <div className="space-y-4 pt-6">
            <div className="flex items-center">
                <hr className="flex-grow border-t border-gray-200" />
                <span className="px-3 text-xs uppercase text-gray-400 font-medium">Or Sign In With</span>
                <hr className="flex-grow border-t border-gray-200" />
            </div>

            <div className="flex space-x-4">
                {/* Google Button */}
                <button
                    type="button"
                    onClick={() => handleSocialLogin('google-oauth2')}
                    className="w-1/2 py-4 bg-white border border-gray-200 text-gray-700 font-bold uppercase text-[10px] tracking-[0.2em] rounded-xl shadow-md hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                    <Mail size={16} /> Google
                </button>

                {/* Facebook Button */}
                <button
                    type="button"
                    onClick={() => handleSocialLogin('facebook')}
                    className="w-1/2 py-4 bg-[#3b5998] text-white font-bold uppercase text-[10px] tracking-[0.2em] rounded-xl shadow-md hover:bg-[#324b81] transition-all flex items-center justify-center gap-2"
                >
                    <Facebook size={16} /> Facebook
                </button>
            </div>
        </div>
    );
}