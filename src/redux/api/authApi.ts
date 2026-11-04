import { baseApi } from "./baseApi";
import type {
  ApiResponse,
  ChangePasswordPayload,
  LoginPayload,
  LoginResult,
  RefreshTokenResult,
  ResetPasswordPayload,
  ResetPasswordResult,
  VerifyResetCodePayload,
} from "../../types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginResult>, LoginPayload>({
      query: (body) => ({
        url: "auth/login",
        method: "POST",
        body,
      }),
    }),
    refreshToken: builder.mutation<ApiResponse<RefreshTokenResult>, void>({
      query: () => ({
        url: "auth/refresh-token",
        method: "POST",
      }),
    }),
    forgetPassword: builder.mutation<ApiResponse<null>, { email: string }>({
      query: (body) => ({
        url: "auth/forget-password",
        method: "POST",
        body,
      }),
    }),
    verifyResetCode: builder.mutation<ApiResponse<null>, VerifyResetCodePayload>({
      query: (body) => ({
        url: "auth/verify-reset-otp",
        method: "POST",
        body,
      }),
    }),
    resendResetCode: builder.mutation<ApiResponse<null>, { email: string }>({
      query: (body) => ({
        url: "auth/resend-reset-code",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<ApiResponse<ResetPasswordResult>, ResetPasswordPayload>({
      query: (body) => ({
        url: "auth/reset-password",
        method: "POST",
        body,
      }),
    }),
    changePassword: builder.mutation<ApiResponse<null>, ChangePasswordPayload>({
      query: (body) => ({
        url: "auth/change-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useForgetPasswordMutation,
  useVerifyResetCodeMutation,
  useResendResetCodeMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
