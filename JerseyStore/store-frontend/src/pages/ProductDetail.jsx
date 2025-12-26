import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { UserContext } from '../context/UserContext';
import { ChevronDown, Star, Zap, Loader2 } from 'lucide-react';
import ReviewSection from '../components/ReviewSection';

export default function ProductDetail({ product: initialProduct }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { isLoggedIn, apiClient } = useContext(UserContext);

  // --- STATE MANAGEMENT ---
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(!initialProduct);
  const [selectedSku, setSelectedSku] = useState(null);
  const [customName, setCustomName] = useState('');
  const [customNumber, setCustomNumber] = useState('');
  const [mainImage, setMainImage] = useState(initialProduct?.main_image || initialProduct?.image);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  // --- DATA FETCHING ---
  useEffect(() => {
    window.scrollTo(0, 0);
    let isMounted = true; 

    const loadJersey = async () => {
      if (!apiClient) return;

      if (!product || product.id !== parseInt(id)) {
        try {
          setLoading(true);
          const res = await apiClient.get(`api/products/${id}/`);
          if (isMounted) {
            setProduct(res.data);
            setMainImage(res.data.main_image || res.data.image);
          }
        } catch (err) {
          console.error("Failed to load jersey details:", err);
        } finally {
          if (isMounted) setLoading(false);
        }
      } else {
        setMainImage(product.main_image || product.image);
      }
    };

    loadJersey();
    return () => { isMounted = false; };
  }, [id, apiClient, product]); 

  // --- HANDLERS ---
  const handleAddToBag = () => {
    if (!selectedSku) {
      alert("Please select a size first!");
      return;
    }
    // Passing the integer ID directly
    addToCart(selectedSku.id, 1, customName, customNumber);
  };

  const handleBuyNow = async () => {
    if (!selectedSku || !selectedSku.id) {
      alert("Please select a size first!");
      return;
    }
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      setIsBuyingNow(true);

      // Payload strictly matches what your PaymentView.create_checkout_session expects
      const payload = {
        sku_id: parseInt(selectedSku.id), // Ensure integer
        qty: 1,
        is_instant: true,
        custom_name: customName.trim().toUpperCase() || "",
        custom_number: customNumber.trim() || ""
      };

      const res = await apiClient.post('api/payment/create-checkout-session/', payload);

      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      // Detailed logging for debugging 400/500 errors
      console.error("BACKEND ERROR DETAILS:", err.response?.data);
      const errorMessage = err.response?.data?.error || "Instant checkout failed.";
      alert(errorMessage);
    } finally {
      setIsBuyingNow(false);
    }
  };

  // --- RENDER LOGIC ---
  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center font-anton uppercase italic text-[#3C486B]">
      <Loader2 className="animate-spin mb-4" size={48} />
      <span>Stadium lights turning on...</span>
    </div>
  );

  if (!product) return (
    <div className="h-screen flex flex-col items-center justify-center font-anton uppercase italic text-red-500">
      <p className="text-3xl">Jersey Not Found</p>
      <button onClick={() => navigate('/shop')} className="mt-4 text-[#3C486B] underline">Return to Lineup</button>
    </div>
  );

  const printingFee = 15.00;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
        
        {/* LEFT: IMAGE VIEWER */}
        <div className="space-y-6">
          <div className="aspect-[4/5] bg-gray-50 rounded-[2.5rem] overflow-hidden p-12 border border-gray-100 flex items-center justify-center relative">
            <img 
              src={mainImage} 
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-700" 
              alt={product.name} 
            />
          </div>
        </div>

        {/* RIGHT: SELECTION PANEL */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.brand || 'Official Kit'}</span>
            <div className="h-px w-8 bg-gray-200"></div>
            <div className="flex items-center text-yellow-500">
              <Star size={10} fill="currentColor" />
              <span className="text-[10px] font-black ml-1 text-[#3C486B]">4.9 (120+ Reviews)</span>
            </div>
          </div>

          <h1 className="font-anton text-5xl md:text-6xl uppercase italic text-[#3C486B] leading-[0.9] mb-4 tracking-tighter">
            {product.team} {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-10">
            <span className="text-4xl font-anton text-[#3C486B] italic">
              ${Number(selectedSku?.price || product.price || 0).toFixed(2)}
            </span>
          </div>

          <div className="mb-8">
            <label className="text-[10px] font-black uppercase tracking-widest block mb-3">Select Size:</label>
            <div className="relative">
              <select 
                value={selectedSku?.id || ""}
                onChange={(e) => {
                    const sku = product.skus.find(s => s.id === parseInt(e.target.value));
                    setSelectedSku(sku || null);
                }}
                className="w-full appearance-none bg-white border-2 border-gray-100 p-5 rounded-2xl font-bold text-sm focus:border-[#3C486B] outline-none cursor-pointer"
              >
                <option value="">Choose Size</option>
                {product.skus?.map(sku => (
                  <option key={sku.id} value={sku.id} disabled={sku.stock_quantity <= 0}>
                    {sku.size} {sku.stock_quantity <= 0 ? '(Sold Out)' : `— $${Number(sku.price).toFixed(2)}`}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>

          {/* PERSONALIZATION BOX */}
          <div className="bg-gray-50/80 p-8 rounded-3xl mb-8 border border-dashed border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black uppercase text-[#3C486B] tracking-widest">Personalize Kit</span>
                <span className="text-[10px] font-black text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100">+${Number(printingFee).toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" placeholder="NAME" value={customName}
                  onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                  className="w-full p-4 rounded-xl border-none ring-1 ring-gray-100 text-xs font-bold uppercase focus:ring-2 focus:ring-[#3C486B] outline-none bg-white"
                />
                <input 
                  type="text" placeholder="NUMBER" value={customNumber} maxLength={2}
                  onChange={(e) => setCustomNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full p-4 rounded-xl border-none ring-1 ring-gray-100 text-xs font-bold focus:ring-2 focus:ring-[#3C486B] outline-none bg-white"
                />
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            <button 
              onClick={handleAddToBag}
              disabled={!selectedSku}
              className={`w-full py-6 rounded-2xl font-anton italic uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 ${selectedSku ? 'bg-[#3C486B] text-white hover:bg-black' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
            >
              Add to Bag
            </button>

            <button 
              onClick={handleBuyNow}
              disabled={!selectedSku || isBuyingNow}
              className={`w-full py-6 rounded-2xl font-anton italic uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 text-lg ${selectedSku ? 'bg-[#E14D2A] text-white hover:bg-[#c93d1d]' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
            >
              {isBuyingNow ? <Loader2 className="animate-spin" size={20} /> : <><Zap size={20} fill="currentColor" /> Buy it Now</>}
            </button>
          </div>
        </div>
      </div>
      <ReviewSection />
    </div>
  );
}