"use client";

import CardWrapper from "./CardWrapper";
import { SubmitHandler, useForm } from "react-hook-form";
import { loginSchema, registerSchema } from "@/schema/auth";
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
import { useLoginUserMutation } from "@/lib/services/authApiSlice";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  isErrorWithMessage,
  isFetchBaseQueryError,
} from "@/lib/services/helpers";
import LoadingIndicator from "@/components/LoadingIndicator";

type FormValues = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values, action) => {
    try {
      await loginUser(values).unwrap();
      toast({
        variant: "destructive",
        title: "Successfully.",
      });
      router.push("/");
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
        headerLabel="Login"
        backButtonLabel="Already have a account?"
        backButtonHref="/login"
        showSocial
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                      />
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
              Login
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </>
  );
};

export default LoginForm;
