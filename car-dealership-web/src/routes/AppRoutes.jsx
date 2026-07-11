import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<div>Login Page</div>} />

      {/* Protected User Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<div>User Dashboard</div>} />
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/inventory" element={<div>Admin Inventory</div>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
