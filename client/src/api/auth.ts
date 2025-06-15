import http from './http';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const register = (data: RegisterPayload) => http.post('/auth/register', data);
export const login = (data: LoginPayload) => http.post('/auth/login', data);
export const getCurrentUser = () => http.get('/auth/me');
export const logout = () => http.get('/auth/logout'); 