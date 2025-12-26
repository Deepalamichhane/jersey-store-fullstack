// src/components/UserProfileSettings.jsx

import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Loader2, User, Key, CheckCircle, AlertTriangle } from 'lucide-react';

export default function UserProfileSettings() {
    const { user, updateProfile, changePassword } = useContext(UserContext);

    // --- Profile State ---
    const [email, setEmail] = useState(user?.email || '');
    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [profileStatus, setProfileStatus] = useState({ message: '', type: '' });
    const [profileLoading, setProfileLoading] = useState(false);

    // --- Password State ---
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordStatus, setPasswordStatus] = useState({ message: '', type: '' });
    const [passwordLoading, setPasswordLoading] = useState(false);

    // --- Handlers ---

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileStatus({ message: '', type: '' });
        setProfileLoading(true);

        const data = { email, first_name: firstName };
        
        // Remove fields that haven't changed to avoid unnecessary API calls
        if (data.email === user.email) delete data.email;
        if (data.first_name === user.first_name) delete data.first_name;
        
        if (Object.keys(data).length === 0) {
             setProfileStatus({ message: 'No changes detected.', type: 'info' });
             setProfileLoading(false);
             return;
        }

        try {
            await updateProfile(data);
            setProfileStatus({ message: 'Profile updated successfully!', type: 'success' });
        } catch (error) {
            let message = 'Failed to update profile. Check email format.';
            if (error.email) message = `Email: ${error.email[0]}`;
            setProfileStatus({ message, type: 'error' });
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordStatus({ message: '', type: '' });
        setPasswordLoading(true);

        if (newPassword !== confirmNewPassword) {
            setPasswordStatus({ message: 'New passwords do not match.', type: 'error' });
            setPasswordLoading(false);
            return;
        }

        try {
            await changePassword(newPassword, currentPassword);
            setPasswordStatus({ message: 'Password changed successfully!', type: 'success' });
            // Clear fields on success
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            let message = 'Failed to change password. Check your current password.';
            if (error.current_password) message = error.current_password[0];
            setPasswordStatus({ message, type: 'error' });
        } finally {
            setPasswordLoading(false);
        }
    };

    const StatusMessage = ({ status }) => {
        if (!status.message) return null;
        const Icon = status.type === 'success' ? CheckCircle : AlertTriangle;
        const color = status.type === 'success' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
        return (
            <div className={`flex items-center p-3 rounded-lg text-sm ${color} mb-6`}>
                <Icon size={16} className="mr-2" />
                {status.message}
            </div>
        );
    };

    return (
        <div className="space-y-12">
            {/* --- Profile Update Section --- */}
            <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-2xl font-serif text-gray-800 mb-6 flex items-center gap-3">
                    <User size={20} className="text-[#f3a5b5]" /> Personal Details
                </h3>
                <StatusMessage status={profileStatus} />
                
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    {/* First Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#f3a5b5] focus:border-[#f3a5b5]"
                        />
                    </div>
                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#f3a5b5] focus:border-[#f3a5b5]"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={profileLoading}
                        className="mt-4 w-full sm:w-auto px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-black transition flex items-center justify-center disabled:opacity-50"
                    >
                        {profileLoading && <Loader2 size={16} className="animate-spin mr-2" />}
                        {profileLoading ? 'Updating...' : 'Save Profile'}
                    </button>
                </form>
            </div>

            {/* --- Password Change Section --- */}
            <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-2xl font-serif text-gray-800 mb-6 flex items-center gap-3">
                    <Key size={20} className="text-[#f3a5b5]" /> Change Password
                </h3>
                <StatusMessage status={passwordStatus} />

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    {/* Current Password Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#f3a5b5] focus:border-[#f3a5b5]"
                            required
                        />
                    </div>
                    {/* New Password Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#f3a5b5] focus:border-[#f3a5b5]"
                            required
                        />
                    </div>
                    {/* Confirm New Password Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#f3a5b5] focus:border-[#f3a5b5]"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={passwordLoading}
                        className="mt-4 w-full sm:w-auto px-6 py-3 bg-[#f3a5b5] text-white font-semibold rounded-lg hover:bg-[#e894a4] transition flex items-center justify-center disabled:opacity-50"
                    >
                        {passwordLoading && <Loader2 size={16} className="animate-spin mr-2" />}
                        {passwordLoading ? 'Changing...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}