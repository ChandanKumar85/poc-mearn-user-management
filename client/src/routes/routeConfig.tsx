import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import DashboardLayout from '../layouts/DashboardLayout';

export const authRoutes = [
  { path: 'login', element: <Login /> },
  { path: 'register', element: <Register /> },
  { path: 'forgot-password', element: <ForgotPassword /> },
  { path: 'reset-password', element: <ResetPassword /> },
];

export const protectedRoutes = [
  { path: 'dashboard', element: <DashboardLayout /> },
];
