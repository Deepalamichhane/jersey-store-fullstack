import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { 
    LayoutDashboard, ShoppingCart, Users, DollarSign, 
    Plus, Package, TrendingUp, ShieldCheck 
} from 'lucide-react';
import UserManager from "../components/admin/UserManager";

export default function AdminDashboard() {
    const { apiClient } = useContext(UserContext);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'users'
    const [stats, setStats] = useState({ 
        total_orders: 0, 
        total_revenue: 0, 
        active_users: 0, 
        inventory_count: 0 
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('admin/stats/') // Ensure your backend route matches
            .then(res => setStats(res.data))
            .catch(err => console.error("Admin Fetch Error:", err))
            .finally(() => setLoading(false));
    }, [apiClient]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-center font-serif italic text-gray-400 animate-pulse">
                    Accessing Locker Room Records...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                
                {/* --- Header & Navigation --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-serif text-gray-800 tracking-widest uppercase">Locker Room Admin</h1>
                        <div className="flex gap-4 mt-2">
                            <button 
                                onClick={() => setActiveTab('overview')}
                                className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === 'overview' ? 'border-[#f3a5b5] text-gray-800' : 'border-transparent text-gray-400'}`}
                            >
                                Overview
                            </button>
                            <button 
                                onClick={() => setActiveTab('users')}
                                className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === 'users' ? 'border-[#f3a5b5] text-gray-800' : 'border-transparent text-gray-400'}`}
                            >
                                User Management
                            </button>
                        </div>
                    </div>
                    <button className="bg-black text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#f3a5b5] transition-all flex items-center gap-2 shadow-lg">
                        <Plus size={16} /> Add New Jersey
                    </button>
                </div>

                {activeTab === 'overview' ? (
                    <>
                        {/* --- Stats Grid --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            <StatCard title="Total Revenue" value={`$${stats.total_revenue?.toLocaleString()}`} icon={<DollarSign/>} color="green" trend="+12%" />
                            <StatCard title="Orders Handled" value={stats.total_orders} icon={<ShoppingCart/>} color="blue" />
                            <StatCard title="Stock Units" value={stats.inventory_count} icon={<Package/>} color="pink" />
                            <StatCard title="Squad Members" value={stats.active_users} icon={<Users/>} color="purple" />
                        </div>

                        {/* --- Recent Activity Section --- */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center gap-2 mb-6">
                                <TrendingUp size={20} className="text-gray-400" />
                                <h2 className="font-serif text-xl text-gray-800 uppercase tracking-wider">Recent Sales Activity</h2>
                            </div>
                            <div className="text-center py-12 border-2 border-dashed border-gray-50 rounded-2xl">
                                <p className="text-gray-400 italic text-sm">Real-time jersey sales charts coming soon.</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <UserManager />
                    </div>
                )}
            </div>
        </div>
    );
}

// Sub-component for Stats to keep code clean
function StatCard({ title, value, icon, color, trend }) {
    const colors = {
        green: "bg-green-50 text-green-600",
        blue: "bg-blue-50 text-blue-600",
        pink: "bg-[#f3a5b5]/10 text-[#f3a5b5]",
        purple: "bg-purple-50 text-purple-600"
    };
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${colors[color]}`}>{icon}</div>
                {trend && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{trend}</span>}
            </div>
            <h3 className="text-gray-500 text-xs uppercase font-black tracking-widest">{title}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
    );
}