"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import ListingForm from "@/components/listings/ListingForm";
import * as api from "@/lib/api";
import { Listing } from "@/types";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";

interface EditPageProps {
  params: { id: string };
}

export default function EditListingPage({ params }: EditPageProps) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    api
      .getListing(params.id)
      .then((res: any) => {
        const item = res.data.listing;
        if (user?.id !== item.userId) {
          setError("You can only edit your own listings");
          return;
        }
        setListing(item);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [params.id, user, isAuthenticated, authLoading, router]);

  const handleSubmit = async (formData: FormData) => {
    const data: any = {};
    formData.forEach((value, key) => {
      if (key !== "images") {
        data[key] = value;
      }
    });
    await api.updateListing(params.id, data);
    router.push(`/listings/${params.id}`);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      await api.deleteListing(params.id);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (authLoading || isLoading) return <div>Loading...</div>;
  if (error) return <Alert type="error" message={error} />;
  if (!listing) return <div>Not found</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Listing</h1>
      <ListingForm initialData={listing} onSubmit={handleSubmit} />
      <div className="max-w-2xl mx-auto mt-6">
        <Button variant="danger" onClick={handleDelete}>
          Delete Listing
        </Button>
      </div>
    </div>
  );
}
