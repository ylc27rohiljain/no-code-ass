import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { api } from './services/api';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Categories } from './pages/Categories';
import { Reports } from './pages/Reports';

// Protected Route Guard
const ProtectedRoute = () => {
  const isAuth = api.isAuthenticated();
  return isAuth ? <Layout><Outlet /></Layout> : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Landing />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
