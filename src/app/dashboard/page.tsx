"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { getMe } from "@/lib/mutation";
import { Button } from "@/components/ui/button";
import Loader from "@/components/global/loader";
import { Navbar } from "@/components";

export default function DashboardPage() {
  return (
    <Suspense fallback={<Loader text="Loading Dashboard" size={150} />}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const { user, token, setAuth, clearAuth } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const tokenFromUrl = searchParams.get("token");

    const fetchUser = async (authToken: string) => {
      try {
        const userData = await getMe(authToken);
        setAuth(userData, authToken);
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError(err.message || "Failed to load dashboard");
        clearAuth();
        router.push("/auth/sign-in");
      } finally {
        setLoading(false);
      }
    };

    if (tokenFromUrl) {
      fetchUser(tokenFromUrl);
      router.replace("/dashboard"); // remove token from URL
    } else if (token) {
      fetchUser(token);
    } else {
      router.push("/auth/sign-in");
      setLoading(false);
    }
  }, [token, searchParams, router, setAuth, clearAuth]);

  const handleLogout = () => {
    clearAuth();
    router.push("/auth/sign-in");
  };

  if (loading) return null; // handled by Suspense

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-center">{error || "User not found."}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-2xl font-semibold">
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
}
