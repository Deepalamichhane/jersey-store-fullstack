import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const BACKEND_BASE_URL = 'http://127.0.0.1:8000';

  // 1. Price Logic (Still pulls from first SKU)
  const firstSku = product.skus?.length > 0 ? product.skus[0] : null;
  const price = firstSku ? firstSku.price : "N/A";
  
  // 2. Simplified Image Logic using main_image from backend
  const getDisplayImage = () => {
    const path = product.main_image;
    if (!path) return 'https://via.placeholder.com/300x400?text=No+Image';
    
    // If Django Serializer already sent the absolute URL (http://...), use it
    if (path.startsWith('http')) return path;
    
    // Otherwise, prepend the base URL
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BACKEND_BASE_URL}${cleanPath}`;
  };

  const imageUrl = getDisplayImage();

  return (
    <div className="jersey-card group flex flex-col h-full shadow-jersey overflow-hidden rounded-[2rem] bg-white transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
      
      {/* Visual Vault (Image Container) */}
      <Link to={`/product/${product.id}`} className="block overflow-hidden aspect-[4/5] bg-stadium-gray relative">
        
        {/* Badge logic based on category */}
        <div className="absolute top-6 left-6 z-20">
          <div className="bg-pitch-black text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-sm bg-opacity-90">
            <div className="w-1.5 h-1.5 bg-jersey-pink rounded-full animate-pulse"></div>
            <span className="text-[8px] font-black uppercase tracking-widest italic">
              {product.category_name?.includes('Authentic') ? 'Pro Edition' : 'Authentic'}
            </span>
          </div>
        </div>

        {/* The Jersey Image */}
        <img 
          src={imageUrl} 
          className="w-full h-full object-contain p-10 transition-transform duration-700 group-hover:scale-110" 
          alt={product.name} 
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=Image+Error'; }}
        />
        
        <div className="absolute inset-0 bg-pitch-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Details Section */}
      <div className="p-8 text-center flex flex-col flex-grow bg-white">
        <p className="label-muted mb-2 text-jersey-pink">
          {product.category_name || 'Season Lineup'}
        </p>
        
        <h3 className="font-anton text-2xl text-pitch-black mb-3 tracking-wide uppercase line-clamp-1 italic">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-center gap-3 mb-8">
            <span className="text-pitch-black font-anton text-2xl">${price}</span>
            {price !== "N/A" && (
              <span className="text-gray-300 text-sm line-through font-bold">
                ${(parseFloat(price) * 1.2).toFixed(2)}
              </span>
            )}
        </div>

        <Link 
          to={`/product/${product.id}`}
          className="mt-auto w-full bg-pitch-black text-white py-4 rounded-xl font-anton italic uppercase tracking-widest text-xs hover:bg-jersey-pink transition-colors duration-300"
        >
          Customize Kit
        </Link>
      </div>
    </div>
  );
}