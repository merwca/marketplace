"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          marketplace
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/search" className="text-gray-700 hover:text-primary">
            Search
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/listings/create" className="text-gray-700 hover:text-primary">
                Post Listing
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-primary">
                Dashboard
              </Link>
              {user?.role === "ADMIN" && (
                <Link href="/admin" className="text-gray-700 hover:text-primary">
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-3 py-1 bg-primary text-white rounded hover:bg-accent"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
