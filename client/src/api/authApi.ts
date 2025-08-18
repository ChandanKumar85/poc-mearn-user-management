import { http } from './http';

export type RegisterPayload = {
  userName: string;
  emailId: string;
  phoneNumber: string;
  password: string;
};

export type LoginPayload = {
  userName: string;
  password: string;
};

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
