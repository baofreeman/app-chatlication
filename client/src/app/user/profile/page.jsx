"use client";

import { useGetUserQuery } from "@/lib/services/auth";
import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState({});
  const { data, isSuccess } = useGetUserQuery();
  useEffect(() => {
    if (data && isSuccess) {
      setUser(data.user);
      console.log(data.user);
    }
  }, [data, isSuccess]);
  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block font-medium mb-2">
            Email: {user.email}
          </label>
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block font-medium mb-2">
            Name: {user.username}
          </label>
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block font-medium mb-2">
            Roles: {user.roles}
          </label>
        </div>
        <div className="mb-4">
          <label htmlFor="verify-email" className="block font-medium mb-2">
            Verify: {user.is_verified && "Yes"}
          </label>
        </div>
      </div>
    </div>
  );
};

export default Profile;
