import { http } from './http';
import type { LoginPayload, RegisterPayload } from './models/auth.interface';

// Register User
export const registerUser = async (data: RegisterPayload) => {
  const response = await http.post('/register', data);
  return response.data;
};

// Login User
export const loginUser = async (data: LoginPayload) => {
  const response = await http.post('/login', data);
  return response.data;
};
