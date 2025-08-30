import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { isTokenValid } from '../pages/auth/services/auth';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = useAuthStore((state) => state.token);
  const clearTokens = useAuthStore((state) => state.clearTokens);

  if (!isTokenValid(token)) {
    clearTokens();
    return <Navigate to="/" replace />;
  }

  return children;
}
