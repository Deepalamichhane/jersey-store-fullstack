import { useEffect, useState, useContext, useRef } from 'react';
import { ShoppingBag, User, Star, Search } from 'lucide-react'; 
import { CartContext } from '../context/CartContext';
import { UserContext } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ onUserClick }) {
  const { cart, setIsRosterOpen } = useContext(CartContext);
  const { user } = useContext(UserContext); 
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  // Calculates total items across all customizations
  const itemCount = cart?.reduce((total, item) => total + item.quantity, 0) || 0;

  // --- Animation Logic for "+50 PTS" Pop-up ---
  const [showPointsPop, setShowPointsPop] = useState(false);
  const prevItemCount = useRef(itemCount);

  useEffect(() => {
    // Trigger animation when items are added to the locker
    if (itemCount > prevItemCount.current) {
      setShowPointsPop(true);
      const timer = setTimeout(() => setShowPointsPop(false), 1500);
      return () => clearTimeout(timer);
    }
    prevItemCount.current = itemCount;
  }, [itemCount]);

  // --- Search Handler ---
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigates to the shop page with the search filter
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(""); // Clear after search
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 lg:px-10 py-5 bg-white border-b border-gray-100 sticky top-0 z-[100] backdrop-blur-md bg-white/90">
      
      <Link to="/" className="text-3xl lg:text-5xl font-anton font-black italic tracking-tighter uppercase group flex items-center">
        <span className="text-[#3C486B] group-hover:text-jersey-pink transition-colors duration-300">
          JERSEY
        </span>
        <span className="text-jersey-pink ml-2 group-hover:text-[#3C486B] transition-colors duration-300">
          ARENA
        </span>
      </Link>

      {/* 2. CENTER SEARCH BAR (Desktop Only) */}
      <div className="hidden lg:flex flex-1 max-w-md mx-10">
        <form onSubmit={handleSearch} className="relative w-full">
          <input 
              type="text"
              placeholder="Search teams, players, or eras..."
              className="w-full bg-gray-50 border border-gray-100 py-2.5 px-5 pl-12 rounded-full text-base font-bold tracking-wide focus:outline-none focus:border-jersey-pink focus:ring-1 focus:ring-jersey-pink/20 transition-all placeholder:text-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </form>
      </div>

      {/* 3. RIGHT ICONS */}
      <div className="flex items-center space-x-4 lg:space-x-6">
        
        {/* MOBILE SEARCH ICON */}
        <button 
          onClick={() => navigate('/shop')}
          className="lg:hidden p-2 text-gray-400 hover:text-pitch-black"
        >
          <Search size={20} />
        </button>

        {/* LOYALTY POINTS DISPLAY */}
        {user && (
          <div className="hidden md:flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100 group cursor-help">
            <Star size={12} className="text-yellow-600 fill-yellow-500 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black text-yellow-700 uppercase tracking-widest">
              {user.points || 0} Pts
            </span>
          </div>
        )}

        {/* USER PROFILE */}
        <div 
          onClick={() => user ? navigate('/dashboard') : onUserClick()} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="p-2 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors">
            <User 
              size={20} 
              className="text-gray-600 group-hover:text-pitch-black transition-transform group-hover:scale-105" 
            />
          </div>
          {user && (
            <span className="hidden xl:block text-[10px] font-black uppercase tracking-widest text-pitch-black">
              {user.username}
            </span>
          )}
        </div>

        {/* SHOPPING BAG + POP-UP ANIMATION */}
        <div 
          onClick={() => setIsRosterOpen(true)} 
          className="relative cursor-pointer group p-2 rounded-full hover:bg-gray-50 transition-colors"
        >
          <ShoppingBag 
            size={22} 
            className="text-gray-800 group-hover:text-jersey-pink transition-colors" 
          />
          
          {/* "+50 PTS" Floating Animation */}
          {showPointsPop && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1 text-jersey-pink font-anton italic animate-bounce pointer-events-none whitespace-nowrap bg-white px-3 py-1 rounded-full shadow-lg border border-jersey-pink/10">
              <Star size={10} className="fill-jersey-pink" />
              <span className="text-xs">+50 PTS</span>
            </div>
          )}

          {/* Item Counter Badge */}
          {itemCount > 0 && (
            <span className="absolute top-1 right-1 bg-jersey-pink text-white text-[8px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-black ring-2 ring-white animate-in zoom-in duration-300">
              {itemCount}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}