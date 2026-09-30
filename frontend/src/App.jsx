import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { QueueProvider } from './context/QueueContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

import { SelectServicePage } from './pages/user/SelectServicePage';
import { MyTokenPage } from './pages/user/MyTokenPage';
import { TokenHistoryPage } from './pages/user/TokenHistoryPage';
import { ProfilePage } from './pages/user/ProfilePage';

import { StaffDashboard } from './pages/staff/StaffDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <QueueProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* User Protected Routes */}
                <Route path="/select-service" element={
                  <ProtectedRoute allowedRoles={['USER', 'STAFF', 'ADMIN']}>
                    <SelectServicePage />
                  </ProtectedRoute>
                } />
                <Route path="/my-token" element={
                  <ProtectedRoute allowedRoles={['USER', 'STAFF', 'ADMIN']}>
                    <MyTokenPage />
                  </ProtectedRoute>
                } />
                <Route path="/token-history" element={
                  <ProtectedRoute allowedRoles={['USER', 'STAFF', 'ADMIN']}>
                    <TokenHistoryPage />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute allowedRoles={['USER', 'STAFF', 'ADMIN']}>
                    <ProfilePage />
                  </ProtectedRoute>
                } />

                {/* Staff Protected Route */}
                <Route path="/staff-dashboard" element={
                  <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
                    <StaffDashboard />
                  </ProtectedRoute>
                } />

                {/* Admin Protected Route */}
                <Route path="/admin-dashboard" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </QueueProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
