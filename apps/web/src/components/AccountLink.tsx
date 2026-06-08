import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

export default function AccountLink() {
  const { user, status } = useAuth();
  const label = status === 'authenticated' && user ? user.firstName : 'Моят профил';
  return (
    <Link to={status === 'authenticated' ? '/account' : '/login'} className="text-sm hover:underline">
      👤 {label}
    </Link>
  );
}
