import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/parents/AuthContext';

export function ParentRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/parents/login" replace />;
  }

  return <>{children}</>;
}