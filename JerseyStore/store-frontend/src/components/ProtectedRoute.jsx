// src/components/ProtectedRoute.jsx

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; // Ensure this path is correct

/**
 * A component that wraps a route and redirects the user if they are not logged in.
 * @param {object} children - The component(s) to render if authenticated (e.g., <UserDashboard />)
 * @param {string} [requiredRole] - Optional role check. Currently supports 'admin'.
 */
export default function ProtectedRoute({ children ,requiredRole }) {
    // Assuming UserContext exposes 'user' which is null if not logged in
    const { user, loading } = useContext(UserContext); 

    // Optional: Show a loading screen while checking auth status
    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <p className="text-gray-600">Loading user session...</p>
            </div>
        );
    }

    // Check if the user object is null or undefined (not logged in)
    if (!user) {
        // Redirect to the login page, but store the previous location 
        // (to redirect back after successful login)
        return <Navigate to="/login" replace />;
    }

    // If logged in, render the child component (the protected page)
    return children;
}