import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { type AuthUserDto, type RegisterDto } from '@decathlon/shared';
import { apiClient, setAccessToken } from '../../lib/apiClient';

type Status = 'loading' | 'authenticated' | 'anonymous';

interface AuthContextValue {
  user: AuthUserDto | null;
  status: Status;
  login: (email: string, password: string) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUserDto | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const qc = useQueryClient();

  useEffect(() => {
    apiClient
      .refresh()
      .then((res) => {
        setAccessToken(res.accessToken);
        setUser(res.user);
        setStatus('authenticated');
      })
      .catch(() => setStatus('anonymous'));
  }, []);

  async function login(email: string, password: string) {
    const res = await apiClient.login({ email, password });
    setAccessToken(res.accessToken);
    setUser(res.user);
    setStatus('authenticated');
    await qc.invalidateQueries();
  }

  async function register(dto: RegisterDto) {
    const res = await apiClient.register(dto);
    setAccessToken(res.accessToken);
    setUser(res.user);
    setStatus('authenticated');
    await qc.invalidateQueries();
  }

  async function logout() {
    await apiClient.logout().catch(() => undefined);
    setAccessToken(null);
    setUser(null);
    setStatus('anonymous');
    qc.clear();
  }

  return (
    <AuthContext.Provider value={{ user, status, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
