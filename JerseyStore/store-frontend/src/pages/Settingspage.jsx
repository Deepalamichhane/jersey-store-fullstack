// SettingsPage.jsx - Refined with brand consistency
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { User, MapPin, Save, Loader2, CheckCircle, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
    const { user, apiClient, fetchUserProfile, token } = useContext(UserContext);
    const [formData, setFormData] = useState({
        first_name: '', last_name: '', address_line1: '', address_line2: '',
        city: '', state: '', postal_code: '', country: 'United States'
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                address_line1: user.address_line1 || '',
                address_line2: user.address_line2 || '',
                city: user.city || '',
                state: user.state || '',
                postal_code: user.postal_code || '',
                country: user.country || 'United States'
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (success) setSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiClient.patch('api/user/profile/update/', formData);
            await fetchUserProfile(token);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 4000);
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-16 bg-white min-h-screen">
            <header className="mb-12">
                <h1 className="text-4xl font-anton italic uppercase text-[#3C486B] tracking-tight">Account Settings</h1>
                <p className="text-gray-400 mt-2 italic">Update your personal details and where we ship your kits.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-12">
                <section>
                    <div className="flex items-center gap-2 mb-6 border-b pb-2">
                        <User size={18} className="text-[#f3a5b5]" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Personal Info</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {['first_name', 'last_name'].map((field) => (
                            <div key={field}>
                                <label className="block text-[10px] font-black uppercase mb-2 text-gray-400">{field.replace('_', ' ')}</label>
                                <input name={field} value={formData[field]} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#f3a5b5]/20 outline-none transition-all text-sm" />
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-6 border-b pb-2">
                        <MapPin size={18} className="text-[#f3a5b5]" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Shipping Address</h2>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase mb-2 text-gray-400">Street Address</label>
                            <input name="address_line1" value={formData.address_line1} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white outline-none text-sm" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="col-span-2">
                                <label className="block text-[10px] font-black uppercase mb-2 text-gray-400">City</label>
                                <input name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase mb-2 text-gray-400">State</label>
                                <input name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase mb-2 text-gray-400">Postal Code</label>
                                <input name="postal_code" value={formData.postal_code} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 outline-none text-sm" />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t">
                    <div className="flex items-center gap-3 text-gray-400">
                        <ShieldCheck size={20} />
                        <p className="text-xs italic font-medium">Your data is handled securely.</p>
                    </div>
                    <button type="submit" disabled={loading} className={`min-w-[200px] flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${success ? 'bg-green-500 text-white' : 'bg-[#3C486B] text-white hover:bg-[#f3a5b5]'}`}>
                        {loading ? <Loader2 size={16} className="animate-spin" /> : success ? <CheckCircle size={16} /> : <Save size={16} />}
                        {loading ? 'Saving...' : success ? 'Profile Updated' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}