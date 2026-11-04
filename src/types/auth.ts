export type AuthRole = 'user' | 'admin' | 'superAdmin';

export interface LoginPayload {
  email: string;
  password: string;
  platform: 'web';
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  role: AuthRole;
}

export interface RefreshTokenResult {
  accessToken: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ResetPasswordPayload {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordResult {
  accessToken: string;
  refreshToken: string;
}

export interface VerifyResetCodePayload {
  email: string;
  resetCode: number;
}
