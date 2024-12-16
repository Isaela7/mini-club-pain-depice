import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ADMIN_EMAIL = 'miniclubnice@eibschools.fr';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated || currentUser?.email !== ADMIN_EMAIL) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}