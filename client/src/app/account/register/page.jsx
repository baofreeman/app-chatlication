"use client";

import Link from "next/link";
import { useFormik } from "formik";
import { registerSchema } from "@/app/validations/schema";
import { useCreateUserMutation } from "@/lib/services/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingIndicator from "@/components/LoadingIndicator";

const initialValues = {
  username: "",
  email: "",
  password: "",
  password_confirmation: "",
};

const Register = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [createUser] = useCreateUserMutation();
  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: async (values, action) => {
      setIsLoading(true);
      try {
        const response = await createUser(values);
        if (response.data && response.data.status === "success") {
          toast.success(response.data.message);
          action.resetForm();
          setIsLoading(false);
          router.push("/account/verify-email");
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
  console.log(errors);
  return (
    <>
      {isLoading && <LoadingIndicator />}
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={values.username}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2"
                placeholder="Enter your name"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </div>
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

            <div className="mb-4">
              <label
                htmlFor="password_confirmation"
                className="block font-medium mb-2"
              >
                Confirm Password
              </label>
              <input
                type="text"
                id="password_confirmation"
                name="password_confirmation"
                value={values.password_confirmation}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2"
                placeholder="Enter your name"
              />
              {errors.password_confirmation && (
                <p className="text-red-500 text-sm">
                  {errors.password_confirmation}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-2 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium disabled:bg-gray-400 rounded-md"
            >
              Register
            </button>
          </form>
          <p className="text-sm text-gray-600 p-1">
            Already an User ?{" "}
            <Link
              href={"/account/login"}
              className="text-indigo-500 hover:text-indigo-600"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
