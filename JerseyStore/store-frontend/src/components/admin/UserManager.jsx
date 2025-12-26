// src/components/admin/UserManager.jsx

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Users, Search, Ban, CheckCircle, Loader2 } from 'lucide-react';
import { UserContext } from '../../context/UserContext';

const API_URL = 'http://127.0.0.1:8000/api/'; 

// Dummy list of user roles for the dropdown
const ROLES = [
    { key: 'customer', label: 'Customer' },
    { key: 'staff', label: 'Staff' },
    { key: 'admin', label: 'Admin' },
];

export default function UserManager() {
    const { token, apiClient } = useContext(UserContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    // 1. Fetch All Users (Requires Admin/Staff Permissions on the Backend)
    const fetchUsers = async () => {
        setLoading(true);
        try {
            // 🚨 IMPORTANT: Use the correct API endpoint for listing all users (often /users/)
            // We use apiClient here for consistency, assuming it's configured for Bearer token auth
            const res = await apiClient.get('users/');
            setUsers(res.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching users:", err.response?.data || err.message);
            setError("Failed to load user data. Check Admin permissions and API endpoint.");
        } finally {
            setLoading(false);
        }
    };

    // 2. Handle User Role Update (e.g., granting staff status)
    const handleRoleUpdate = async (userId, newRole) => {
        if (!window.confirm(`Are you sure you want to change user #${userId}'s role to ${newRole.toUpperCase()}?`)) {
            return;
        }

        const originalUsers = users;
        
        // Optimistic UI Update: Change the role locally and mark as updating
        setUsers(users.map(user => 
            user.id === userId ? { 
                ...user, 
                is_staff: newRole === 'staff' || newRole === 'admin',
                is_superuser: newRole === 'admin',
                updating: true 
            } : user
        ));

        try {
            // 🚨 IMPORTANT: Use the correct API endpoint for user update (often /users/{id}/)
            // You will need to map `newRole` to Django's `is_staff` and `is_superuser` fields on the backend.
            await apiClient.patch(`${API_URL}users/${userId}/`, {
                is_staff: newRole === 'staff' || newRole === 'admin',
                is_superuser: newRole === 'admin',
            });
            
            // Finalize UI update
            setUsers(users => users.map(user => 
                user.id === userId ? { ...user, updating: false } : user
            ));
        } catch (err) {
            console.error("Error updating user role:", err.response?.data || err.message);
            alert(`Failed to update role for user #${userId}.`);
            setUsers(originalUsers); // Rollback on failure
        }
    };

    const getRole = (user) => {
        if (user.is_superuser) return 'admin';
        if (user.is_staff) return 'staff';
        return 'customer';
    };

    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && !users.length) {
        return <div className="p-10 text-center"><Loader2 size={24} className="animate-spin mx-auto text-[#f3a5b5]"/> Loading Users...</div>;
    }

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center pb-4 border-b">
                <h2 className="text-2xl font-serif text-gray-800 flex items-center gap-2">
                    <Users size={24} className="text-[#e894a4]"/> User Management ({users.length})
                </h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by username or email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-full text-sm w-64 focus:border-[#f3a5b5] outline-none"
                    />
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </header>

            {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-x-auto border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Username</th>
                            <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{user.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${getRole(user) === 'admin' ? 'text-pink-600 bg-pink-100' :
                                          getRole(user) === 'staff' ? 'text-blue-600 bg-blue-100' : 
                                          'text-gray-600 bg-gray-100'}`
                                    }>
                                        {getRole(user).toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {user.is_active ? 
                                        <CheckCircle size={18} className="text-green-500" title="Active"/> : 
                                        <Ban size={18} className="text-red-500" title="Deactivated"/>
                                    }
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <select
                                        value={getRole(user)}
                                        onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                                        disabled={user.updating || loading}
                                        className="border border-gray-300 rounded-lg p-2 text-xs focus:ring-[#f3a5b5] focus:border-[#f3a5b5] cursor-pointer disabled:opacity-50"
                                    >
                                        {ROLES.map((role) => (
                                            <option key={role.key} value={role.key}>{role.label}</option>
                                        ))}
                                    </select>
                                    {user.updating && <Loader2 size={16} className="animate-spin text-blue-500 inline ml-2" />}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-10 text-center text-gray-500 italic">No users found matching your search.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}