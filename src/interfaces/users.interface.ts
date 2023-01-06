export interface User {
  id: number;
  email: string;
  password?: string;
  isActive: boolean;
  name: string;
  role: 'WORKER' | 'MANAGER' | 'ADMIN';
}
