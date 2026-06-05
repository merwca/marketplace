"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import * as api from "@/lib/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsLoading(false);
    }
  }, [user, isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsSaving(true);

    try {
      const data: any = {};
      if (name !== user?.name) data.name = name;
      if (email !== user?.email) data.email = email;
      if (password) data.password = password;

      if (Object.keys(data).length === 0) {
        setError("No changes to save");
        return;
      }

      await api.updateProfile(data);
      setPassword("");
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {error && <Alert type="error" message={error} onClose={() => setError("")} />}
      {success && <Alert type="success" message="Settings updated successfully" />}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded border">
        <Input
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="New Password (leave blank to keep current)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}
