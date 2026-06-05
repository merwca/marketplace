"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import * as api from "@/lib/api";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  banned: boolean;
  createdAt: string;
  _count: { listings: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/");
      return;
    }

    if (user?.role === "ADMIN") {
      loadUsers();
    }
  }, [user, isAuthenticated, authLoading, router]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const res: any = await api.getAdminUsers();
      setUsers(res.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleBan = async (id: string) => {
    try {
      await api.toggleUserBan(id);
      loadUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (authLoading || isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      {error && <Alert type="error" message={error} onClose={() => setError("")} />}

      {users.length === 0 ? (
        <div className="text-center py-8 text-gray-600">No users found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b font-bold">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Listings</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                  <td className="p-3">{u._count.listings}</td>
                  <td className="p-3">
                    {u.banned ? (
                      <span className="text-red-600 font-bold">Banned</span>
                    ) : (
                      <span className="text-green-600">Active</span>
                    )}
                  </td>
                  <td className="p-3">
                    <Button
                      size="sm"
                      variant={u.banned ? "secondary" : "danger"}
                      onClick={() => handleToggleBan(u.id)}
                    >
                      {u.banned ? "Unban" : "Ban"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
