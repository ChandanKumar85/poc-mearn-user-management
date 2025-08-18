import { Outlet } from 'react-router-dom';
import { AuthRoute } from './AuthRoute';

const AuthScreen = () => {
  return (
    <>
      <AuthRoute />
      <Outlet />
    </>
  );
};

export default AuthScreen;
