import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../context/UserContext'; 
import { Filter, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
    { id: '', name: 'All Jerseys' },
    { id: 'nba', name: 'NBA Jerseys' },
    { id: 'soccer', name: 'Soccer Kits' },
    { id: 'nfl', name: 'NFL Jerseys' },
    { id: 'retro', name: 'Retro & Throwback' },
    { id: 'custom', name: 'Custom Jerseys' },
];

// --- Skeleton Component for Loading State ---
const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="aspect-[4/5] bg-gray-200 rounded-[2.5rem] mb-6"></div>
    <div className="h-8 bg-gray-200 w-3/4 rounded-lg mb-3"></div>
    <div className="h-5 bg-gray-100 w-1/2 rounded-md"></div>
  </div>
);

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const location = useLocation();
    const navigate = useNavigate();

    const searchParams = new URLSearchParams(location.search);
    const currentSearch = searchParams.get('search') || '';
    const currentCategory = searchParams.get('category') || '';
    const currentPage = parseInt(searchParams.get('page')) || 1;
    const pageSize = 9; 

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        let url = `api/products/?page=${currentPage}&page_size=${pageSize}`;
        if (currentSearch) url += `&search=${currentSearch}`;
        if (currentCategory) url += `&category=${currentCategory}`;

        try {
            const res = await apiClient.get(url); 
            const data = res.data.results || (Array.isArray(res.data) ? res.data : []); 
            const count = res.data.count || (Array.isArray(res.data) ? res.data.length : 0);

            setProducts(data);
            setTotalProducts(count);
            setTotalPages(Math.ceil(count / pageSize) || 1);
        } catch (err) {
            console.error("Error fetching jerseys:", err);
            setProducts([]);
        } finally {
            // Adding a tiny delay or keeping it immediate for a professional feel
            setLoading(false);
        }
    }, [currentPage, currentSearch, currentCategory, pageSize]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]); 

    const handleCategoryChange = (categoryId) => {
        const newParams = new URLSearchParams();
        if (currentSearch) newParams.set('search', currentSearch);
        if (categoryId) newParams.set('category', categoryId);
        newParams.set('page', 1); 
        navigate({ search: newParams.toString() });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
             const newParams = new URLSearchParams(location.search);
             newParams.set('page', newPage);
             navigate({ search: newParams.toString() });
             window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const titleText = currentSearch 
        ? `Search: ${currentSearch}` 
        : currentCategory 
            ? CATEGORIES.find(c => c.id === currentCategory)?.name || 'Collection'
            : 'Season Lineup';

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
            
            {/* --- Refined Header --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                <div>
                    <h1 className="text-6xl md:text-7xl font-anton italic leading-none">
                        {titleText}
                    </h1>
                    <div className="flex items-center gap-3 mt-4">
                        <span className="bg-jersey-pink h-1 w-12 rounded-full"></span>
                        <p className="label-muted text-pitch-black">
                            {loading ? "..." : totalProducts} Authentic Items
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-grow md:min-w-[240px]">
                        <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-pitch-black" />
                        <select
                            value={currentCategory}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="w-full pl-12 pr-10 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-jersey-pink outline-none appearance-none cursor-pointer"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* --- Content Area --- */}
            {loading ? (
                // --- Skeleton Grid ---
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => <SkeletonCard key={i} />)}
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-40 bg-white rounded-[3rem] border border-gray-100 shadow-jersey">
                    <p className="font-anton text-3xl italic mb-8 uppercase text-gray-300">Out of Stock In This Category</p>
                    <button onClick={() => handleCategoryChange('')} className="btn-primary">
                        Return to Catalog
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* --- Sports-Style Pagination --- */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-8 mt-24">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-5 border border-gray-100 bg-white rounded-full hover:bg-pitch-black hover:text-white disabled:opacity-20 transition-all shadow-jersey"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            
                            <div className="text-center">
                                <span className="label-muted text-gray-300 block mb-1">Quarter</span>
                                <span className="font-anton text-3xl italic">
                                    {currentPage} <span className="text-jersey-pink">/</span> {totalPages}
                                </span>
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-5 border border-gray-100 bg-white rounded-full hover:bg-pitch-black hover:text-white disabled:opacity-20 transition-all shadow-jersey"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}