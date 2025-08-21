export interface RegisterPayload {
  userName: string;
  emailId: string;
  phoneNumber: string;
  password: string;
}

export interface LoginPayload {
  userName: string;
  password: string;
}
