import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  if (status === 'loading') return <p className="text-gray-500">Зареждане…</p>;
  if (status === 'anonymous') return <Navigate to="/login" replace />;
  return <>{children}</>;
}
