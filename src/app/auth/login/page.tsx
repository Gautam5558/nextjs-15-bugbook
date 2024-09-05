import LoginForm from "@/components/forms/login-form";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import loginImage from "@/assets/login-image.jpg";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

const LoginPage = () => {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Login to bugbook</h1>
            <p className="text-muted-foreground">welcome back</p>
          </div>
          <div className="space-y-5">
            <LoginForm />
            <Link
              href={"/auth/register"}
              className="block text-center hover:underline"
            >
              Dont have an account? Sign up
            </Link>
          </div>
        </div>
        <Image
          src={loginImage}
          alt="signup"
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
};

export default LoginPage;
