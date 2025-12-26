import React, { useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { ShoppingBag, Settings, LogOut, Package, Star, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Sub-component for the high-end header section.
 * Optimized for readability with the "Jersey Arena" italic minimalist aesthetic.
 */
const DashboardHeader = ({ userName }) => (
  <div className="relative overflow-hidden rounded-[3.5rem] bg-white p-10 md:p-16 mb-12 border border-gray-100 shadow-sm min-h-[340px] flex items-center">
    
    {/* Massive decorative background number - watermark style */}
    <div className="absolute -right-10 -bottom-24 text-[320px] font-anton text-gray-100/40 select-none pointer-events-none leading-none italic">
      10
    </div>
    
    <div className="relative z-10 w-full">
      <div className="flex items-center gap-3 mb-8">
        <span className="bg-jersey-pink h-1.5 w-12 rounded-full"></span>
        <p className="text-[10px] uppercase tracking-[0.4em] font-black text-jersey-pink">
          Locker Room Entry
        </p>
      </div>

      {/* Main Heading - Using the Anton font and high contrast colors */}
      <h1 className="text-4xl md:text-6xl font-anton mb-10 italic uppercase leading-[0.85] text-[#3C486B] tracking-tighter max-w-5xl">
        Hello, <br />
        <span className="text-pitch-black underline decoration-jersey-pink/20 decoration-[12px] underline-offset-[16px]">
          {userName}
        </span>
      </h1>

      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mt-6">
        <p className="text-sm text-gray-400 font-medium tracking-wide max-w-md leading-relaxed italic border-l-2 border-gray-100 pl-6">
          Welcome back to the <span className="text-[#3C486B] font-bold">Jersey Arena</span>. 
          Manage your kits, track shipments, and gear up for the match.
        </p>
      </div>
    </div>
  </div>
);

export default function UserDashboard() {
  const { user, logout, loading } = useContext(UserContext);
  const navigate = useNavigate();

  // AUTH GUARD: Redirect to login if session is invalid
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-jersey-pink"></div>
          <p className="font-anton uppercase tracking-widest text-[#3C486B]">Accessing Locker...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const displayName = user.first_name || user.username || 'MVP';

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-white min-h-screen">
      
      {/* Header Section */}
      <DashboardHeader userName={displayName} />

      {/* Logout Action */}
      <div className="flex justify-end mb-10">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-300 hover:text-jersey-pink transition-all group uppercase text-[10px] font-black tracking-[0.2em]"
        >
          <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Exit Locker Room
        </button>
      </div>

      {/* Interactive Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">

        {/* Loyalty Status */}
        <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-jersey hover:shadow-2xl transition-all group relative overflow-hidden">
          <Trophy className="text-jersey-pink mb-4 group-hover:rotate-12 transition-transform" size={28} />
          <h3 className="font-anton text-2xl mb-1 text-pitch-black uppercase tracking-tight italic">
            {user.tier || 'Rookie'} Status
          </h3>
          <p className="text-[10px] uppercase font-bold text-jersey-pink mb-4 tracking-widest">
            {user.points || 0} Points
          </p>
          <p className="text-xs text-gray-400 leading-relaxed italic">
            Earning on every kit. Reach Pro for exclusive drops.
          </p>
        </div>

        {/* Order History */}
        <div 
          className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-jersey hover:shadow-2xl transition-all cursor-pointer group"
          onClick={() => navigate('/orders')}
        >
          <Package className="text-gray-200 group-hover:text-pitch-black mb-4 transition-colors" size={28} />
          <h3 className="font-anton text-2xl mb-2 text-pitch-black uppercase tracking-tight italic">Shipments</h3>
          <p className="text-xs text-gray-400 mb-6 italic leading-relaxed">Track your latest kit arrivals and past hauls.</p>
          <span className="text-[9px] font-black uppercase tracking-widest text-pitch-black border-b-2 border-jersey-pink pb-1">
            View All
          </span>
        </div>

        {/* Settings */}
        <div 
          className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-jersey hover:shadow-2xl transition-all cursor-pointer group"
          onClick={() => navigate('/settings')}
        >
          <Settings className="text-gray-200 group-hover:text-pitch-black mb-4 transition-colors" size={28} />
          <h3 className="font-anton text-2xl mb-2 text-pitch-black uppercase tracking-tight italic">Identity</h3>
          <p className="text-xs text-gray-400 mb-6 italic leading-relaxed">Modify your address, sizes, and credentials.</p>
          <span className="text-[9px] font-black uppercase tracking-widest text-pitch-black border-b-2 border-jersey-pink pb-1">
            Edit Profile
          </span>
        </div>

        {/* Wishlist */}
        <div 
          className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-jersey hover:shadow-2xl transition-all cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <ShoppingBag className="text-gray-200 group-hover:text-pitch-black mb-4 transition-colors" size={28} />
          <h3 className="font-anton text-2xl mb-2 text-pitch-black uppercase tracking-tight italic">My Locker</h3>
          <p className="text-xs text-gray-400 mb-6 italic leading-relaxed">Items saved for your next match-day rotation.</p>
          <span className="text-[9px] font-black uppercase tracking-widest text-pitch-black border-b-2 border-jersey-pink pb-1">
            Open Locker
          </span>
        </div>

      </div>

      {/* Referral Promotion Card */}
      <div className="rounded-[3rem] bg-stadium-gray p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm rotate-3">
             <Star className="text-jersey-pink" fill="#f3a5b5" size={36} />
          </div>
          <div>
            <h4 className="font-anton text-4xl text-[#3C486B] uppercase tracking-tighter italic">Invite a Teammate</h4>
            <p className="text-sm text-gray-400 font-medium italic mt-1">Share the arena. You both get $10 off the next kit.</p>
          </div>
        </div>
        <button className="bg-pitch-black text-white px-12 py-5 font-anton uppercase italic tracking-[0.2em] hover:bg-jersey-pink transition-all rounded-2xl shadow-xl active:scale-95">
          Get Referral Link
        </button>
      </div>
      
    </div>
  );
}