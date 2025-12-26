import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Added this
import { UserContext } from '../context/UserContext';
import { 
    Package, Clock, CheckCircle, Search, Filter, 
    AlertTriangle, ChevronRight, Loader2 
} from 'lucide-react';

export default function OrderHistoryPage() {
    const navigate = useNavigate(); // Initialize navigate
    const { apiClient, token } = useContext(UserContext);
    
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const fetchOrders = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const params = {};
            if (filterStatus !== 'All') params.status = filterStatus; 
            if (searchTerm.trim()) params.search = searchTerm.trim();

            const res = await apiClient.get('api/orders/', { params });
            setOrders(res.data);
        } catch (err) {
            console.error("Error fetching orders:", err.response?.data || err.message);
            setError("Failed to load order history.");
        } finally {
            setLoading(false);
        }
    }, [token, apiClient, filterStatus, searchTerm]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);
    
    // Updated: Now navigates to the dynamic route /orders/ID
    const viewOrderDetails = (orderId) => {
        navigate(`/orders/${orderId}`);
    };

    const StatusBadge = ({ status }) => {
        let classes = 'bg-gray-50 text-gray-600';
        let Icon = Clock;
        switch (status) {
            case 'Delivered':
                classes = 'bg-green-50 text-green-600';
                Icon = CheckCircle;
                break;
            case 'Processing':
                classes = 'bg-orange-50 text-orange-600';
                Icon = Clock;
                break;
            case 'Canceled':
                classes = 'bg-red-50 text-red-600';
                Icon = AlertTriangle;
                break;
            default: break;
        }
        return (
            <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase px-3 py-1.5 rounded-full ${classes}`}>
                <Icon size={10}/> {status}
            </span>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-16 bg-white min-h-[80vh]">
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 border-b pb-6">
                <h1 className="text-4xl font-serif text-gray-800 tracking-tight flex items-center gap-3 mb-4 sm:mb-0">
                    <Package size={30} className="text-[#f3a5b5]"/> My Orders
                </h1>
                
                <div className="flex flex-wrap gap-4 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <input 
                            type="text" 
                            placeholder="Search order ref..." 
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:ring-[#f3a5b5] focus:border-[#f3a5b5] text-sm outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                    </div>

                    <div className="relative w-full sm:w-40">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="appearance-none block w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full text-sm bg-white outline-none"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Processing">Processing</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Canceled">Canceled</option>
                        </select>
                        <Filter size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"/>
                    </div>
                </div>
            </header>
            
            <div className="bg-white rounded-xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/70 border-b border-gray-100">
                                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-gray-500">Order Ref</th>
                                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-gray-500">Date</th>
                                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-gray-500">Status</th>
                                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-gray-500">Total</th>
                                <th className="px-8 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? orders.map((order) => (
                                <tr key={order.id} className="border-t border-gray-50 hover:bg-[#fcf8fa] transition-colors group">
                                    <td className="px-8 py-4 text-sm font-bold text-gray-700">#GLW-{order.id}</td>
                                    <td className="px-8 py-4 text-xs text-gray-400 font-medium">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-4"><StatusBadge status={order.status} /></td>
                                    <td className="px-8 py-4 text-sm font-black text-gray-800">${parseFloat(order.total_amount).toFixed(2)}</td>
                                    <td className="px-8 py-4 text-right">
                                        <button 
                                            className="bg-[#f3a5b5] text-white hover:bg-black px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center ml-auto"
                                            onClick={() => viewOrderDetails(order.id)}
                                        >
                                            Details <ChevronRight size={14} className="ml-1"/>
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <p className="text-gray-400 italic mb-4">No orders found.</p>
                                        <button onClick={() => navigate('/')} className="text-xs font-black uppercase tracking-widest text-[#f3a5b5] underline">
                                            Go to Shop
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}