"use client";

import Link from "next/link";
import { useFormik } from "formik";
import { loginSchema } from "@/app/validations/schema";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useLoginMutation } from "@/lib/services/auth";

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [login] = useLoginMutation();
  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, action) => {
      setIsLoading(true);
      try {
        const response = await login(values);
        if (response.data && response.data.status === "success") {
          action.resetForm();
          toast.success(response.data.message);
          router.push("/user/profile");
          setIsLoading(false);
        }

        if (response.error && response.error.data.status === "failed") {
          toast.error(response.error.data.message);
          setIsLoading(false);
        }
        console.log(response);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    },
  });
  const handleGoogleLogin = async () => {
    window.open(`http://localhost:8080/auth/google`, "_self");
  };
  return (
    <>
      {isLoading && <LoadingIndicator />}
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block font-medium mb-2">
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2"
                placeholder="Enter your name"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block font-medium mb-2">
                Password
              </label>
              <input
                type="text"
                id="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2"
                placeholder="Enter your name"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
            <p className="text-sm text-gray-600 p-1">
              <Link
                href={"/account/reset-password-link"}
                className="text-indigo-500 hover:text-indigo-600"
              >
                Forgot password ?
              </Link>
            </p>

            <button
              type="submit"
              className="w-full px-2 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium disabled:bg-gray-400 rounded-md"
            >
              Login
            </button>
          </form>
          <p className="text-sm text-gray-600 p-1">
            Already an User ?{" "}
            <Link
              href={"/account/register"}
              className="text-indigo-500 hover:text-indigo-600"
            >
              New a account
            </Link>
          </p>
          <button
            type="submit"
            onClick={handleGoogleLogin}
            className="w-full px-2 py-4 bg-white hover:bg-gray-500 text-black font-medium disabled:bg-gray-400 rounded-md border border-black"
          >
            Login with Google
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
