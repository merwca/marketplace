"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useEffect } from "react";

export default function AdminPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/");
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!isAuthenticated || user?.role !== "ADMIN") return null;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded p-6 hover:shadow-lg">
          <h2 className="text-xl font-bold mb-3">Manage Listings</h2>
          <p className="text-gray-600 mb-4">Review, delete, and moderate listings</p>
          <Link href="/admin/listings">
            <Button>Go to Listings</Button>
          </Link>
        </div>

        <div className="border rounded p-6 hover:shadow-lg">
          <h2 className="text-xl font-bold mb-3">Manage Users</h2>
          <p className="text-gray-600 mb-4">View users and manage bans</p>
          <Link href="/admin/users">
            <Button>Go to Users</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
