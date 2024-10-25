export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}