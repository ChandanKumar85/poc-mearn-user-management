export interface RegisterPayload {
  userName: string;
  emailId: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  userName: string;
  password: string;
}

export interface JwtPayload {
  exp: number;
  activeId: string;
}
