import React, { useEffect, useState } from 'react';
import { apiClient } from '../context/UserContext'; // Using your configured client
import ProductCard from './ProductCard';
import { Loader2 } from 'lucide-react';

export default function RelatedProducts({ categoryId, currentProductId }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products in the same category
    const url = categoryId 
        ? `api/products/?category=${categoryId}` 
        : 'api/products/';

    apiClient.get(url)
      .then(res => {
        // Handle both paginated and non-paginated data
        const allProducts = Array.isArray(res.data) ? res.data : res.data.results;
        
        // Filter out the current product and take the first 3
        const filtered = allProducts
          .filter(p => p.id !== currentProductId)
          .slice(0, 3);
          
        setRelated(filtered);
      })
      .catch(err => console.error("Error fetching related items:", err))
      .finally(() => setLoading(false));
  }, [categoryId, currentProductId]);

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-pink-400" /></div>;
  if (related.length === 0) return null;

  return (
    <div className="mt-20 border-t pt-16">
      <h2 className="font-serif text-2xl text-center mb-12 text-gray-800 uppercase tracking-widest">
        Pairs well with
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {related.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}