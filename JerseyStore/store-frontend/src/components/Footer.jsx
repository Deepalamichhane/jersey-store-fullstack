import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Truck, RefreshCcw, Award, Instagram, Twitter, Facebook, Send } from 'lucide-react';

// --- Sub-Component: Trust Bar ---
const GuaranteeBar = () => {
  const benefits = [
    { icon: <Award size={24} />, title: "Premium Fabric", desc: "Authentic kit feel" },
    { icon: <Truck size={24} />, title: "Fast Delivery", desc: "Tracked worldwide" },
    { icon: <RefreshCcw size={24} />, title: "Easy Returns", desc: "30-day window" },
    { icon: <ShieldCheck size={24} />, title: "Secure Pay", desc: "SSL Encrypted" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-y border-gray-100 bg-white">
      {benefits.map((item, i) => (
        <div key={i} className="flex flex-col items-center text-center group">
          <div className="mb-4 p-4 bg-stadium-gray rounded-2xl text-jersey-pink group-hover:bg-jersey-pink group-hover:text-white transition-all duration-300 shadow-sm">
            {item.icon}
          </div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-pitch-black">{item.title}</h4>
          <p className="text-xs text-slate-muted mt-1 italic">{item.desc}</p>
        </div>
      ))}
    </div>
  );
};

// --- Main Footer Component ---
export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      // Endpoint updated to your local API
      await axios.post('http://127.0.0.1:8000/api/newsletter/', { email: email });
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error("Subscription error:", error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <footer className="bg-white">
      {/* 1. Newsletter Section (The Drop Alert) */}
      <section className="bg-pitch-black py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-['Anton'] text-3xl md:text-5xl text-white uppercase italic tracking-tighter mb-4">
            Don't Miss the Next Drop
          </h2>
          <p className="text-gray-400 mb-8 italic text-sm md:text-base">
            Join the inner circle for early access to limited edition kits and exclusive member offers.
          </p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="ENTER YOUR EMAIL" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-jersey-pink transition-all font-bold text-sm"
              required
            />
            <button 
              type="submit"
              disabled={status === 'loading'}
              className="bg-jersey-pink hover:bg-white hover:text-pitch-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 flex items-center justify-center gap-2"
            >
              {status === 'loading' ? 'Joining...' : status === 'success' ? 'Welcome to the Squad' : (
                <>Subscribe <Send size={16} /></>
              )}
            </button>
          </form>
          {status === 'error' && <p className="text-red-500 text-[10px] mt-4 font-bold uppercase tracking-widest">Error. Please try again.</p>}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        {/* 2. Trust Bar Section */}
        <GuaranteeBar />

        {/* 3. Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-20">
          <div className="col-span-1">
            <h2 className="font-['Anton'] text-4xl italic uppercase mb-6 tracking-tighter text-jersey-pink">JERSEY ARENA</h2>
            <p className="text-sm text-slate-muted leading-relaxed max-w-xs">
              Providing athletes and fans with the highest quality authentic kits since 2024. Engineering the future of fan-wear.
            </p>
            <div className="mt-6">
               <h4 className="text-[10px] font-black uppercase tracking-widest mb-2">Our Stadium</h4>
               <p className="text-xs text-slate-muted italic">10 Soccer Blvd, Sports City, TX 75201</p>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-6">Collections</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-muted">
              <li><Link to="/products" className="hover:text-jersey-pink transition-colors">All Jerseys</Link></li>
              <li><Link to="/" className="hover:text-jersey-pink transition-colors">Premier League</Link></li>
              <li><Link to="/" className="hover:text-jersey-pink transition-colors">La Liga</Link></li>
              <li><Link to="/" className="hover:text-jersey-pink transition-colors">International Kits</Link></li>
              <li><Link to="/" className="hover:text-jersey-pink transition-colors">Retro Classics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-6">Support</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-muted">
              <li><Link to="/orders" className="hover:text-jersey-pink transition-colors">Track Order</Link></li>
              <li><Link to="/" className="hover:text-jersey-pink transition-colors">Size Guide</Link></li>
              <li><Link to="/" className="hover:text-jersey-pink transition-colors">Shipping Policy</Link></li>
              <li><Link to="/" className="hover:text-jersey-pink transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/" className="hover:text-jersey-pink transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-6">Connect</h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="p-3 bg-stadium-gray rounded-xl hover:bg-jersey-pink hover:text-white transition-all"><Instagram size={20} /></a>
              <a href="#" className="p-3 bg-stadium-gray rounded-xl hover:bg-jersey-pink hover:text-white transition-all"><Twitter size={20} /></a>
              <a href="#" className="p-3 bg-stadium-gray rounded-xl hover:bg-jersey-pink hover:text-white transition-all"><Facebook size={20} /></a>
            </div>
            <div className="bg-stadium-gray p-4 rounded-2xl">
                <p className="text-[9px] text-pitch-black font-black uppercase tracking-widest leading-relaxed">
                  Join 10,000+ athletes in the locker room.
                </p>
            </div>
          </div>
        </div>

        {/* 4. Bottom Legal Bar */}
        <div className="border-t border-gray-100 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            © 2025 JERSEY ARENA . ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
             {/* Payment Icons Placeholder */}
            <div className="flex gap-4 grayscale opacity-50 hover:opacity-100 transition-opacity">
                <span className="text-[9px] font-black uppercase tracking-tighter">Visa</span>
                <span className="text-[9px] font-black uppercase tracking-tighter">MC</span>
                <span className="text-[9px] font-black uppercase tracking-tighter">Apple Pay</span>
                <span className="text-[9px] font-black uppercase tracking-tighter">Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}