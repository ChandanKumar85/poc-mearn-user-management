import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { isTokenValid } from '../utils/auth';
import type { JSX } from 'react';

interface PublicRouteProps {
  children: JSX.Element;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);

  if (isAuthenticated && isTokenValid(token)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
