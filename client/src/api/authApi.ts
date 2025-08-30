import { http } from './http';
import type { LoginPayload, RegisterPayload } from './models/auth.interface';

// Register User
export const registerUser = async (data: RegisterPayload) => {
  const response = await http.post('/register', data);
  return response.data;
};

// Login User
export const loginUser = async (data: LoginPayload) => {
  try {
    const response = await http.post('/login', data);
    const result = response.data;

    // if backend sends message in normal JSON
    if (result.message === 'NO_USER_FOUND' || result.message === 'ALREADY_LOGGED_IN_ON_ANOTHER_DEVICE') {
      throw new Error(result.message);
    }

    return result;
  } catch (err: any) {
    // if axios puts error in request.response
    let backendMessage = 'UNKNOWN_ERROR';

    try {
      if (err?.request?.response) {
        backendMessage = JSON.parse(err.request.response).message;
      }
    } catch {
      backendMessage = err.message;
    }

    throw new Error(backendMessage);
  }
};

// Logout User
export const logoutUser = async (data: { activeId: string }) => {
  const response = await http.post('/logout', data);
  return response.data;
};
