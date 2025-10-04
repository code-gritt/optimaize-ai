"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, LoaderIcon } from "lucide-react";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { useAuthStore } from "@/lib/store";
import { login, getMe } from "@/lib/mutation";
import { useRouter } from "next/navigation";

const SignInForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const token = await login(email, password);
      const user = await getMe(token);

      if (!user) throw new Error("Failed to fetch user data");

      setAuth(user, token);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Sign-in error:", err);
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://optimaize-api.onrender.com/oauth/google";
  };

  return (
    <div className="flex flex-col items-start gap-y-6 py-8 w-full px-0.5">
      <h2 className="text-2xl font-semibold">Sign in to OptimAIzer</h2>

      <form onSubmit={handleSignIn} className="w-full">
        <div className="space-y-2 w-full">
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

        <div className="mt-4 w-full flex flex-col gap-2">
          <Button type="submit" className="w-full">
            {isLoading ? (
              <LoaderIcon className="w-5 h-5 animate-spin" />
            ) : (
              "Sign in with email"
            )}
          </Button>
          <Button
            type="button"
            className="w-full bg-gray-600 hover:bg-gray-700 text-white"
            onClick={handleGoogleLogin}
          >
            Sign in with Google
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
