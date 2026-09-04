import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingState from './LoadingState';

/**
 * ProtectedRoute
 * Protects dashboard layouts and sub-routes by verifying authentication and role authorization.
 * 
 * - If unauthenticated: redirects to /login with the target role parameter.
 * - If authenticated with wrong role: redirects to the user's appropriate role dashboard.
 * - If authorized: renders the nested routes via <Outlet />.
 */
export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingState message="Verifying institutional authorization..." />
      </div>
    );
  }

  // If user is not authenticated, redirect to login page with appropriate role context
  if (!isAuthenticated || !user) {
    const defaultRoleParam = allowedRoles.length > 0 ? allowedRoles[0] : 'admin';
    return (
      <Navigate
        to={`/login?role=${defaultRoleParam}&redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  // If user is authenticated, check if their role matches the route's allowed roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Route to user's assigned dashboard based on their role
    const roleDashboardMap = {
      admin: '/admin',
      faculty: '/faculty',
      student: '/student'
    };

    const target = roleDashboardMap[user.role] || '/roles';
    return <Navigate to={target} replace />;
  }

  return <Outlet />;
}
