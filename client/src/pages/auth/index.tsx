import { Outlet } from 'react-router-dom';

const AuthScreen = () => {
  return (
    <div className="auth-wrapper">
      <Outlet />
    </div>
  );
};

export default AuthScreen;
