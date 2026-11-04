import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "");
export const API_BASE_URL = !configuredApiBaseUrl
  ? "/api/v1"
  : configuredApiBaseUrl.endsWith("/api/v1")
    ? configuredApiBaseUrl
    : configuredApiBaseUrl.endsWith("/api")
      ? `${configuredApiBaseUrl}/v1`
      : `${configuredApiBaseUrl}/api/v1`;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const accessToken =
      localStorage.getItem("mha_access_token") ||
      sessionStorage.getItem("mha_access_token");
    if (accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  const requestUrl = typeof args === "string" ? args : args.url;
  const hasAccessToken = Boolean(
    localStorage.getItem("mha_access_token") ||
    sessionStorage.getItem("mha_access_token")
  );

  if (
    result.error?.status === 401 &&
    hasAccessToken &&
    requestUrl !== "auth/login" &&
    requestUrl !== "auth/refresh-token"
  ) {
    const refreshResult = await rawBaseQuery(
      { url: "auth/refresh-token", method: "POST" },
      api,
      extraOptions
    );
    const data = refreshResult.data;
    const accessToken =
      typeof data === "object" &&
      data !== null &&
      "data" in data &&
      typeof data.data === "object" &&
      data.data !== null &&
      "accessToken" in data.data &&
      typeof data.data.accessToken === "string"
        ? data.data.accessToken
        : null;

    if (accessToken) {
      const storage = localStorage.getItem("mha_access_token")
        ? localStorage
        : sessionStorage;
      storage.setItem("mha_access_token", accessToken);
      result = await rawBaseQuery(args, api, extraOptions);
    } else if (
      !refreshResult.error ||
      (typeof refreshResult.error.status === "number" &&
        [400, 401, 403].includes(refreshResult.error.status))
    ) {
      localStorage.removeItem("mha_access_token");
      localStorage.removeItem("mha_auth_user");
      sessionStorage.removeItem("mha_access_token");
      sessionStorage.removeItem("mha_auth_user");
      window.dispatchEvent(new Event("mha:session-expired"));
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Message",
    "Report",
    "Post",
    "Purchase",
    "Topic",
    "Resource",
    "Faq",
    "Settings",
  ],
  endpoints: () => ({}),
});
