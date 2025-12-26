import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Authmodal({ isOpen, onClose }) {
  if (!isOpen) return null;
  const navigate = useNavigate();

  const handleNavigate = (path) => {
      onClose();
      navigate(path);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-black">
          <X size={20} />
        </button>

        <div className="p-10 text-center">
          <h2 className="text-2xl font-bold uppercase tracking-widest mb-2">Unlock Your Squad Benefits</h2>
          <p className="text-gray-500 text-sm mb-8">
            Log in to unlock your **Loyalty Points** and exclusive member discounts on customized jerseys.
          </p>

          <div className="space-y-4">
            <button 
                onClick={() => handleNavigate('/login')} 
                // Color changed from pink to a strong blue/slate: #3C486B
                className="w-full py-4 bg-[#3C486B] text-white font-bold uppercase rounded-xl shadow-md hover:bg-[#2C385B] transition-all" 
            >
              Login to My Account
            </button>
            <button 
                onClick={() => handleNavigate('/register')}
                className="w-full py-4 bg-gray-900 text-white font-bold uppercase rounded-xl shadow-md hover:bg-black transition-all"
            >
              Create an Account
            </button>
          </div>

          <button onClick={onClose} className="mt-6 text-xs text-gray-400 underline uppercase tracking-tighter">
            Continue as Guest (No Points Earned)
          </button>
        </div>
      </div>
    </div>
  );
}