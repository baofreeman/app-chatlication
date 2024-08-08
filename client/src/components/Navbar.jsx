"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LoadingIndicator from "./LoadingIndicator";
import Cookies from "js-cookie";

const Navbar = () => {
  const [isAuth, setIsAuth] = useState(null);
  useEffect(() => {
    const authCookies = Cookies.get("is_auth");
    setIsAuth(authCookies);
  }, []);
  return (
    <>
      {isAuth === null && <LoadingIndicator />}
      <nav className="bg-purple-800 p-4">
        <div className="flex items-center justify-center">
          <Link href={"/"} className="text-white mr-4">
            Home
          </Link>
          {isAuth ? (
            <Link href={"/user/profile"} className="text-white mr-4">
              Profile
            </Link>
          ) : (
            <>
              <Link href={"/account/login"} className="text-white mr-4">
                Login
              </Link>
              <Link href={"/account/register"} className="text-white mr-4">
                Sign In
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
