import type { AuthResponse, UserInfo } from '../types';
import { api, tokenStorage } from './api';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await api<AuthResponse>('/auth/login', { method: 'POST', body: { email, password } });
    tokenStorage.set(res.token);
    return res;
  },
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const res = await api<AuthResponse>('/auth/register', { method: 'POST', body: { name, email, password } });
    tokenStorage.set(res.token);
    return res;
  },
  me: () => api<UserInfo>('/users/me'),
  logout: () => tokenStorage.clear(),
};
