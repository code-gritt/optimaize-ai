"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Label } from "../ui/label";
import { register, login, getMe } from "@/lib/mutation";
import { useAuthStore } from "@/lib/store";
import Loader from "../global/loader";

const SignUpForm = () => {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Handles initial signup (register + login + fetch user)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Register user
      await register(email, password);

      // Immediately log in
      const token = await login(email, password);
      const user = await getMe(token);

      if (!user) throw new Error("Failed to fetch user data");

      // Update auth store
      setAuth(user, token);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Sign-up error:", err);
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Handles email verification (if using OTP)
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Verification code verified!");
    setIsVerifying(false);
  };

  if (isLoading)
    return (
      <Loader text={isVerifying ? "Verifying" : "Signing up"} size={220} />
    );

  return isVerifying ? (
    <div className="flex flex-col items-start w-full text-start gap-y-6 py-8 px-0.5">
      <h2 className="text-2xl font-semibold">Verify your account</h2>
      <p className="text-sm text-muted-foreground">
        To continue, please enter the 6-digit verification code we just sent to{" "}
        {email}.
      </p>
      <form onSubmit={handleVerifyEmail} className="w-full">
        <div className="space-y-2 w-full pl-0.5">
          <Label htmlFor="code">Verification code</Label>
          <InputOTP
            id="code"
            name="code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e)}
            className="pt-2"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <div className="mt-4 w-full">
          <Button type="submit" className="w-full">
            Verify code
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Didn't receive the code?{" "}
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toast.success("Verification code resent to your email.");
            }}
            className="text-primary"
          >
            Resend code
          </Link>
        </p>
      </form>
    </div>
  ) : (
    <div className="flex flex-col items-start gap-y-6 py-8 w-full px-0.5">
      <h2 className="text-2xl font-semibold">Create an account</h2>

      <form onSubmit={handleSignUp} className="w-full">
        <div className="space-y-2 w-full">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full focus-visible:border-foreground"
          />
        </div>
        <div className="mt-4 space-y-2 w-full">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full focus-visible:border-foreground"
          />
        </div>
        <div className="mt-4 space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative w-full">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full focus-visible:border-foreground"
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute top-1 right-1"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

        <div className="mt-4 w-full">
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
