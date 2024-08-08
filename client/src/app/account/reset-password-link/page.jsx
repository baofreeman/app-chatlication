"use client";

import Link from "next/link";
import { useFormik } from "formik";
import { resetPasswordSchema } from "@/app/validations/schema";
import { useState } from "react";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useResetPasswordLinkMutation } from "@/lib/services/auth";
import { toast } from "react-toastify";

const initialValues = {
  email: "",
};

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resetPasswordLink] = useResetPasswordLinkMutation();
  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema: resetPasswordSchema,
    onSubmit: async (values, action) => {
      setIsLoading(true);
      try {
        const response = await resetPasswordLink(values);
        if (response.data && response.data.status === "success") {
          setIsLoading(false);
          action.resetForm();
          toast.success(response.data.message);
        }

        if (response.error && response.error.data.status === "failed") {
          setIsLoading(false);
          toast.error(response.error.data.message);
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
          <h2 className="text-2xl font-bold mb-6 text-center">
            Reset Password
          </h2>
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-2 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium disabled:bg-gray-400 rounded-md"
            >
              Send
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
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
