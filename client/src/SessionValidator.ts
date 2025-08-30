import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { http } from './api/http';
import { useAuthStore } from './store/authStore';

interface JwtPayload {
  activeId: string;
}

const SessionValidator = () => {
  const { token, clearTokens } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    const decoded = jwtDecode<JwtPayload>(token);

    http
      .post('/check-session', { activeId: decoded.activeId })
      .then((res) => {
        if (!res.data.valid) {
          clearTokens();
          navigate('/login');
        }
      })
      .catch(() => {
        clearTokens();
        navigate('/login');
      });
  }, [token]);

  return null;
};

export default SessionValidator;
