// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthScreen from '../pages/auth';
import Dashboard from '../pages/dashboard/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthScreen />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
