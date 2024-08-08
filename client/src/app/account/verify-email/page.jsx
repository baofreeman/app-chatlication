"use client";

import { useFormik } from "formik";
import { verifyEmailSchema } from "@/app/validations/schema";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useVerifyEmailMutation } from "@/lib/services/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const initialValues = {
  email: "",
  otp: "",
};

const VerifyEmail = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [verifyEmail] = useVerifyEmailMutation();

  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema: verifyEmailSchema,
    onSubmit: async (values, action) => {
      setIsLoading(true);
      try {
        const response = await verifyEmail(values);
        if (response.data && response.data.status === "success") {
          setIsLoading(false);
          action.resetForm();
          toast.success(response.data.message);
          router.push("/account/login");
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
            Verify your account
          </h2>
          <p className="text-sm text-center mb-6">
            Check your email for OTP. OTP is valid for 15 minutes
          </p>
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
              <label htmlFor="otp" className="block font-medium mb-2">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={values.otp}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2"
                placeholder="Enter your name"
              />
              {errors.otp && (
                <p className="text-red-500 text-sm">{errors.otp}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full px-2 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium disabled:bg-gray-400 rounded-md"
            >
              Verify
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
