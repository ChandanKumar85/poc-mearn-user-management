import { Routes, Route, Navigate } from 'react-router-dom';
import { authRoutes, protectedRoutes } from './routeConfig';
import AuthScreen from '../pages/auth';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public (Auth) routes */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <AuthScreen />
          </PublicRoute>
        }
      >
        {authRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>

      {/* Protected routes */}
      {protectedRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={`/${path}`}
          element={<ProtectedRoute>{element}</ProtectedRoute>}
        />
      ))}
    </Routes>
  );
}
