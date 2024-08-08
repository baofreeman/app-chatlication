"use client";

import { useLogoutMutation } from "@/lib/services/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingIndicator from "./LoadingIndicator";

const UserSidebar = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [logout] = useLogoutMutation();
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await logout();
      if (response.data && response.data.status === "success") {
        setIsLoading(false);
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading && <LoadingIndicator />}
      <div className="bg-purple-800 h-screen text-white p-4">
        <div className="mt-6">
          <Link href={"/"} className="text-white text-center mr-4">
            Home
          </Link>
        </div>
        <nav className="bg-purple-800 p-4">
          <ul>
            <li>
              <div className="mb-4">
                <Link href={"/user/profile"} className="text-white mr-4">
                  Profile
                </Link>
              </div>
            </li>
            <li>
              <div className="mb-4">
                <Link
                  href={"/user/change-password"}
                  className="text-white mr-4"
                >
                  Change Password
                </Link>
              </div>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full px-2 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium disabled:bg-gray-400 rounded-md"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};
export default UserSidebar;
