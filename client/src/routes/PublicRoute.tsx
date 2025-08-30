import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { isTokenValid } from '../pages/auth/services/auth';

interface PublicRouteProps {
  children: JSX.Element;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const token = useAuthStore((state) => state.token);
  const clearTokens = useAuthStore((state) => state.clearTokens);

  if (token && !isTokenValid(token)) {
    clearTokens();
  }

  if (isTokenValid(token)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
