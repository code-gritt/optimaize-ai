"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { getMe } from "@/lib/mutation";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components";
import Loader from "@/components/global/loader";

const DashboardPage = () => {
  const { user, token, setUser, clearAuth } = useAuthStore();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const fetchedUser = await getMe(token);
        if (!fetchedUser) throw new Error("User not authenticated");
        setUser(fetchedUser);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard");
        if (err.message.includes("not authenticated")) router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, router, setUser]);

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
