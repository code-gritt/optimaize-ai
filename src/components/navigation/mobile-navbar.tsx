"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Menu, X, LucideIcon } from "lucide-react";
import { cn, NAV_LINKS } from "@/utils";
import { useAuthStore } from "@/lib/store";

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, token, clearAuth } = useAuthStore();

  const handleClose = () => setIsOpen(false);
  const handleLogout = () => {
    clearAuth();
    handleClose();
  };

  return (
    <div className="flex lg:hidden items-center justify-end">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button size="icon" variant="ghost">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>

        <SheetContent className="w-screen">
          {/* Close button */}
          <SheetClose asChild className="absolute top-3 right-5 z-20">
            <Button size="icon" variant="ghost">
              <X className="w-5 h-5" />
            </Button>
          </SheetClose>

          <div className="flex flex-col items-start w-full py-6 mt-12 space-y-4 px-4">
            {/* Authenticated user info */}
            {user && token ? (
              <div className="flex flex-col w-full gap-2 mb-4">
                <span className="text-sm text-muted-foreground">
                  Credits: {user.credits}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    handleClose();
                    window.location.href = "/dashboard";
                  }}
                >
                  Dashboard
                </Button>
                <Button size="sm" className="w-full" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col w-full gap-2">
                <Link
                  href="/auth/sign-in"
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full",
                  })}
                  onClick={handleClose}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/sign-up"
                  className={buttonVariants({ className: "w-full" })}
                  onClick={handleClose}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Navigation links with Accordion */}
            <ul className="flex flex-col w-full mt-4">
              <Accordion type="single" collapsible className="w-full">
                {NAV_LINKS.map((link) => (
                  <AccordionItem
                    key={link.title}
                    value={link.title}
                    className="last:border-none"
                  >
                    {link.menu ? (
                      <>
                        <AccordionTrigger>{link.title}</AccordionTrigger>
                        <AccordionContent>
                          <ul className="w-full">
                            {link.menu.map((menuItem) => (
                              <ListItem
                                key={menuItem.title}
                                title={menuItem.title}
                                href={menuItem.href}
                                icon={menuItem.icon}
                                onClick={handleClose}
                              >
                                {menuItem.tagline}
                              </ListItem>
                            ))}
                          </ul>
                        </AccordionContent>
                      </>
                    ) : (
                      <Link
                        href={link.href!}
                        onClick={handleClose}
                        className="flex items-center w-full py-4 font-medium text-muted-foreground hover:text-foreground"
                      >
                        {link.title}
                      </Link>
                    )}
                  </AccordionItem>
                ))}
              </Accordion>
            </ul>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  title: string;
  href: string;
  icon: LucideIcon;
  children?: React.ReactNode;
  onClick?: () => void;
}

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  ({ title, href, icon: Icon, children, onClick, ...props }, ref) => {
    return (
      <li>
        <Link
          href={href}
          ref={ref}
          onClick={onClick}
          className={cn(
            "block select-none rounded-lg p-3 leading-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          )}
          {...props}
        >
          <div className="flex items-center space-x-2 text-foreground">
            <Icon className="w-4 h-4" />
            <h6 className="text-sm font-medium">{title}</h6>
          </div>
          {children && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
              {children}
            </p>
          )}
        </Link>
      </li>
    );
  }
);

ListItem.displayName = "ListItem";

export default MobileNavbar;
