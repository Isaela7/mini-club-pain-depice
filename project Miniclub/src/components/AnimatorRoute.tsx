import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/animator/AuthContext';

export function AnimatorRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/animator/login" replace />;
  }

  return <>{children}</>;
}