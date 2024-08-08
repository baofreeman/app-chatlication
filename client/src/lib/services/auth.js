// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080/api/auth/" }),
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (user) => {
        return {
          url: "register",
          method: "POST",
          body: user,
          headers: { "Content-Type": "application/json" },
        };
      },
    }),
    verifyEmail: builder.mutation({
      query: (user) => {
        return {
          url: "verify-email",
          method: "POST",
          body: user,
          headers: { "Content-Type": "application/json" },
        };
      },
    }),
    login: builder.mutation({
      query: (user) => {
        return {
          url: "login",
          method: "POST",
          body: user,
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        };
      },
    }),
    getUser: builder.query({
      query: () => {
        return {
          url: "me",
          method: "GET",
          credentials: "include",
        };
      },
    }),
    logout: builder.mutation({
      query: () => {
        return {
          url: "logout",
          method: "POST",
          body: {},
          credentials: "include",
        };
      },
    }),
    resetPasswordLink: builder.mutation({
      query: (user) => {
        return {
          url: "reset-password-link",
          method: "POST",
          body: user,
          headers: { "Content-Type": "application/json" },
        };
      },
    }),
    resetPassword: builder.mutation({
      query: (data) => {
        const { id, token, ...values } = data;
        const actualData = { ...values };
        return {
          url: `reset-password/${id}/${token}`,
          method: "POST",
          body: actualData,
          headers: { "Content-Type": "application/json" },
        };
      },
    }),
    changePassword: builder.mutation({
      query: (actualData) => {
        return {
          url: `change-password`,
          method: "POST",
          body: actualData,
          credentials: "include",
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useCreateUserMutation,
  useVerifyEmailMutation,
  useLoginMutation,
  useGetUserQuery,
  useLogoutMutation,
  useResetPasswordLinkMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
