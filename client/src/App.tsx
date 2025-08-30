import AppRoutes from './routes/AppRoutes';
import SessionValidator from './SessionValidator';

function App() {
  return (
    <div className="h-screen">
      <SessionValidator />
      <AppRoutes />
    </div>
  );
}

export default App;
