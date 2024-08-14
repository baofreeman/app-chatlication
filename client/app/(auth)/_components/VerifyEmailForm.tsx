"use client";

import React from "react";
import CardWrapper from "./CardWrapper";
import { SubmitHandler, useForm } from "react-hook-form";
import { verifyEmailSchema } from "@/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useVerifyEmailMutation } from "@/lib/services/authApiSlice";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  isErrorWithMessage,
  isFetchBaseQueryError,
} from "@/lib/services/helpers";
import LoadingIndicator from "@/components/LoadingIndicator";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type FormValues = {
  email: string;
  otp: string;
};

const VerifyEmailForm = () => {
  const [verifyEmail, { isLoading, isSuccess, error }] =
    useVerifyEmailMutation();
  const router = useRouter();
  const form = useForm<z.infer<typeof verifyEmailSchema>>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values, action) => {
    try {
      await verifyEmail(values).unwrap();
      toast({
        variant: "destructive",
        title: "Successfully.",
      });
      router.push("/login");
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const errMsg =
          "error" in error ? error.error : JSON.stringify(error.data);
        const parseMsg = JSON.parse(errMsg);
        toast({
          variant: "destructive",
          title: parseMsg.message,
        });
      } else if (isErrorWithMessage(error)) {
        toast({
          variant: "destructive",
          title: error.message,
        });
      }
    }
  };
  return (
    <>
      {isLoading && <LoadingIndicator />}
      <CardWrapper
        headerLabel="Register"
        backButtonLabel="Already have a account?"
        backButtonHref="/login"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={4} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              variant={"destructive"}
              disabled={isLoading}
              className="w-full"
            >
              Verify
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </>
  );
};

export default VerifyEmailForm;
