"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ZapIcon } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { cn, NAV_LINKS } from "@/utils";
import MaxWidthWrapper from "../global/max-width-wrapper";
import AnimationContainer from "../global/animation-container";
import MobileNavbar from "./mobile-navbar";
import { Icons } from "../global/icons";

const Navbar = () => {
  const [scroll, setScroll] = useState(false);
  const { user, token, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleScroll = () => setScroll(window.scrollY > 8);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.push("/auth/sign-in");
  };

  return (
    <header
      className={cn(
        "sticky top-0 inset-x-0 h-14 w-full border-b border-transparent z-[99999] select-none",
        scroll && "border-background/80 bg-background/40 backdrop-blur-md"
      )}
    >
      <AnimationContainer reverse delay={0.1} className="size-full">
        <MaxWidthWrapper className="flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <Link href="/#home" className="flex items-center gap-x-2">
              <Icons.logo className="w-6 h-6" />
              <h1 className="text-lg font-medium">OptimAIzer</h1>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-x-4">
            {user && token ? (
              <>
                <span className="credits ml-2">Credits: {user.credits}</span>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="rounded-md bg-[#2B892E] px-4 py-2 text-white hover:bg-[#225f22] focus:outline-none focus:ring-2 focus:ring-[#2B892E]"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="ml-2 rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Logout
                </button>
                <span className="avatar ml-2">
                  {user.email.charAt(0).toUpperCase()}
                </span>
              </>
            ) : (
              <>
                <Link
                  href="/auth/sign-in"
                  className={buttonVariants({ size: "sm", variant: "ghost" })}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/sign-up"
                  className={buttonVariants({ size: "sm" })}
                >
                  Get Started
                  <ZapIcon className="size-3.5 ml-1.5 text-orange-500 fill-orange-500" />
                </Link>
              </>
            )}
          </div>

          <MobileNavbar />
        </MaxWidthWrapper>
      </AnimationContainer>
    </header>
  );
};

export default Navbar;
