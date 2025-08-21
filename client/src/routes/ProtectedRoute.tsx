import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { isTokenValid } from '../utils/auth';
import type { JSX } from 'react';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);

  if (!isAuthenticated || !isTokenValid(token)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
