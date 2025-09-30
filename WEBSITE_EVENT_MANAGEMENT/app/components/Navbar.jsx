"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { NAV_LINKS } from "../constants";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const userId = user?.user?._id;
  console.log("Navbar User:", userId);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Don't render on server

  return (
    <nav className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-indigo-600 text-white">
            <span className="text-lg font-bold">CE</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">Campus Events</span>
        </div>

        <ul className="hidden gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex gap-4">
          {user ? (
            <button
              onClick={() => router.push(`/student-dashboard/${userId}`)}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Hello, {user?.user?.name}
            </button>
          ) : (
            <>
              <a
                href="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Login
              </a>
              <a
                href="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Sign Up
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
