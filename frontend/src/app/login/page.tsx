"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Login</h1>

      {error && <Alert type="error" message={error} onClose={() => setError("")} />}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded border">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <Button type="submit" disabled={isLoading} className="w-full mb-4">
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>

      <p className="text-center text-gray-600 mt-4">
        Don't have an account?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>

      <div className="mt-6 p-4 bg-gray-50 rounded border text-sm">
        <p className="font-bold mb-2">Demo Credentials:</p>
        <p>Email: user1@example.com</p>
        <p>Password: user123</p>
      </div>
    </div>
  );
}
