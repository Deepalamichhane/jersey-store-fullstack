import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../context/UserContext';

export default function RelatedKits({ currentProductId, team }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_BASE_URL = 'http://127.0.0.1:8000';

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        // Fetching jerseys from the same team, excluding the current one
        const res = await apiClient.get(`api/products/?team=${team}`);
        const filtered = res.data
          .filter(item => item.id.toString() !== currentProductId.toString())
          .slice(0, 4); // Limiting to 4 items for a clean grid
        setRelated(filtered);
      } catch (err) {
        console.error("Error fetching related kits:", err);
      } finally {
        setLoading(false);
      }
    };

    if (team) fetchRelated();
  }, [team, currentProductId]);

  if (loading || related.length === 0) return null;

  return (
    <div className="border-t border-gray-100 pt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-jersey-pink mb-3">
            Complete the Collection
          </p>
          <h2 className="font-anton text-4xl md:text-5xl italic uppercase tracking-tighter text-pitch-black leading-none">
            More from {team}
          </h2>
        </div>
        <Link 
          to="/" 
          className="text-[10px] font-black uppercase tracking-widest border-b-2 border-pitch-black pb-1 hover:text-jersey-pink hover:border-jersey-pink transition-all"
        >
          View Full Lineup
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {related.map((kit) => {
          const firstSku = kit.skus?.length > 0 ? kit.skus[0] : null;
          const imageUrl = firstSku?.image?.startsWith('http') 
            ? firstSku.image 
            : `${BACKEND_BASE_URL}${firstSku?.image}`;

          return (
            <Link 
              key={kit.id} 
              to={`/product/${kit.id}`} 
              className="group flex flex-col h-full"
            >
              {/* Proportional Image Container */}
              <div className="aspect-[4/5] bg-gray-50 rounded-[2rem] overflow-hidden mb-6 relative border border-transparent group-hover:border-gray-100 transition-all">
                <img 
                  src={imageUrl || 'https://via.placeholder.com/300x400'} 
                  alt={kit.name}
                  className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-pitch-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Scaled-down Typography */}
              <div className="px-2">
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">
                  {kit.category_name || 'Official Kit'}
                </p>
                <h4 className="font-anton text-lg italic uppercase tracking-tight text-pitch-black mb-2 line-clamp-1 group-hover:text-jersey-pink transition-colors">
                  {kit.name}
                </h4>
                <p className="font-anton text-xl italic text-pitch-black/40">
                  ${firstSku?.price || '0.00'}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}