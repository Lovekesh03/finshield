import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TradingProvider } from './context/TradingContext';

// Import Pages (will be created in next step)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Trade from './pages/Trade';
import Transfer from './pages/Transfer';
import SafeExplore from './pages/SafeExplore';
import Profile from './pages/Profile';
import Layout from './components/Layout';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/trade" element={
        <ProtectedRoute>
          <Layout>
            <Trade />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/transfer" element={
        <ProtectedRoute>
          <Layout>
            <Transfer />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/safe-explore" element={
        <ProtectedRoute>
          <Layout>
            <SafeExplore />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout>
            <Profile />
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <TradingProvider>
        <Router>
          <AppRoutes />
        </Router>
      </TradingProvider>
    </AuthProvider>
  );
}

export default App;
