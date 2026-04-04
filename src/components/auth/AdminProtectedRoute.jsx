import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { auth } from "../../firebase";

/**
 * A wrapper for admin-only routes.
 * If the user is not logged in, redirect them to the admin login page.
 */
export function AdminProtectedRoute({ children, loading }) {
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        background: "var(--bg)", 
        flexDirection: "column", 
        gap: "18px" 
      }}>
        <div style={{ 
          width: "48px", 
          height: "48px", 
          borderRadius: "50%", 
          border: "3px solid transparent", 
          borderTopColor: "var(--neon)", 
          animation: "spin .8s linear infinite" 
        }} />
        <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
        <div style={{ fontSize: "13px", color: "var(--text2)" }}>Verifying session…</div>
      </div>
    );
  }

  if (!auth.currentUser) {
    // Redirect to login but save the current location to redirect back after login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
