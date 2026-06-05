"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import ListingForm from "@/components/listings/ListingForm";
import * as api from "@/lib/api";
import { useEffect } from "react";

export default function CreateListingPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  const handleSubmit = async (formData: FormData) => {
    const res: any = await api.createListing(formData);
    router.push(`/listings/${res.data.id}`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Post a New Listing</h1>
      <ListingForm onSubmit={handleSubmit} />
    </div>
  );
}
