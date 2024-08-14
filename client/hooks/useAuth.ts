import { useGetUserQuery, User } from "@/lib/services/authApiSlice";

// type ResolverResult = Omit<User, "password">
export const useAuth = () => {
  let user;
  const { data: currentUser } = useGetUserQuery();
  user = { ...currentUser };

  return user;
};
