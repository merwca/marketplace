"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import * as api from "@/lib/api";
import { Listing } from "@/types";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { formatPrice, getCategoryLabel, formatDate } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "reported">("all");
  const [error, setError] = useState("");
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/");
      return;
    }

    if (user?.role === "ADMIN") {
      loadListings();
    }
  }, [user, isAuthenticated, authLoading, filter, router]);

  const loadListings = async () => {
    try {
      setIsLoading(true);
      const res: any = await api.getAdminListings({
        reported: filter === "reported",
      });
      setListings(res.data.listings);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      await api.deleteListingAdmin(id);
      setListings(listings.filter((l) => l.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (authLoading || isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Listings</h1>

      {error && <Alert type="error" message={error} onClose={() => setError("")} />}

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${
            filter === "all" ? "bg-primary text-white" : "border"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("reported")}
          className={`px-4 py-2 rounded ${
            filter === "reported" ? "bg-primary text-white" : "border"
          }`}
        >
          Reported
        </button>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-8 text-gray-600">No listings found</div>
      ) : (
        <div className="space-y-2">
          {listings.map((listing) => (
            <div key={listing.id} className="border rounded p-4 flex gap-4 items-start">
              {listing.images.length > 0 && (
                <img
                  src={`${API_URL}/uploads/${listing.images[0]}`}
                  alt={listing.title}
                  className="w-16 h-16 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <div className="flex-1">
                <h3 className="font-bold">{listing.title}</h3>
                <p className="text-sm text-gray-600">
                  {getCategoryLabel(listing.category)} • {listing.city} • {formatDate(listing.createdAt)}
                </p>
                <p className="text-sm text-gray-600">By {listing.user.name}</p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(listing.id)}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
