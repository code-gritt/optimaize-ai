"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { getMe } from "@/lib/mutation";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components";
import Loader from "@/components/global/loader";

const DashboardPage = () => {
  const { user, token, setUser, setAuth, clearAuth } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");

    const fetchUser = async (authToken: string) => {
      try {
        const fetchedUser = await getMe(authToken);
        if (!fetchedUser) throw new Error("User not authenticated");

        setUser(fetchedUser);
        if (tokenFromUrl) setAuth(fetchedUser, authToken); // Update store if from OAuth
        if (tokenFromUrl) router.replace("/dashboard"); // Clean URL
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard");
        clearAuth();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    if (tokenFromUrl) {
      fetchUser(tokenFromUrl);
    } else if (token) {
      fetchUser(token);
    } else {
      router.push("/login");
    }
  }, [token, searchParams, router, setUser, setAuth, clearAuth]);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader text="Loading Dashboard" size={150} />
      </div>
    );
  }

  if (!user) {
    return (
      <p className="text-red-500 text-center mt-8">
        {error || "User not found."}
      </p>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-xl font-medium">
          Welcome, {user.email.split("@")[0]}!
        </h1>
        <p className="text-gray-500">Credits: {user.credits}</p>
        <div className="flex gap-4 mt-4">
          <Button onClick={() => router.push("/")} variant="outline">
            Back to Home
          </Button>
          <Button onClick={handleLogout}>Sign Out</Button>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
