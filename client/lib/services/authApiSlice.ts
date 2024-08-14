import { apiSlice } from "./apiSlice";

export interface User {
  _id: string;
  email: string;
  name: string;
  password: string;
  password_confirmation: string;
  bio?: string;
  friends?: string[];
  friendRequests?: string[];
  is_verified?: boolean;
  roles?: string[];
  theme?: string;
  lastSeen?: Date;
}

interface VerifyEmail {
  email: string;
  otp: string;
}

interface LoginUser {
  email: string;
  password: string;
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<User, Partial<User>>({
      query: (credentials) => ({
        url: "auth/register",
        method: "POST",
        body: credentials,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: (result) => (result ? ["UNAUTHORIZED"] : []),
    }),
    verifyEmail: builder.mutation<VerifyEmail, Partial<VerifyEmail>>({
      query: (credentials) => ({
        url: "auth/verify-email",
        method: "POST",
        body: credentials,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    loginUser: builder.mutation<LoginUser, Partial<User>>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      invalidatesTags: (result) => (result ? ["UNAUTHORIZED"] : []),
    }),
    getUser: builder.query<
      Omit<User, "password" | "password_confirmation">,
      void
    >({
      query: () => ({
        url: "auth/me",
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error) => {
        return result
          ? [{ type: "User", id: result?._id }]
          : error?.status === 401
          ? ["UNAUTHORIZED"]
          : ["UNKNOWN_ERROR"];
      },
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useVerifyEmailMutation,
  useLoginUserMutation,
  useGetUserQuery,
} = authApiSlice;
