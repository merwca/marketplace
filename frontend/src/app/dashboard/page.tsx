"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import * as api from "@/lib/api";
import { Listing } from "@/types";
import Button from "@/components/ui/Button";
import { formatPrice, formatDate, getCategoryLabel } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function DashboardPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!authLoading && isAuthenticated) {
      setIsLoading(true);
      api
        .getUserListings()
        .then((res: any) => setListings(res.data))
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Link href="/listings/create">
          <Button>Post New Listing</Button>
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't posted any listings yet</p>
          <Link href="/listings/create">
            <Button>Create Your First Listing</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div key={listing.id} className="border rounded p-4 flex gap-4 hover:bg-gray-50">
              {listing.images.length > 0 && (
                <img
                  src={`${API_URL}/uploads/${listing.images[0]}`}
                  alt={listing.title}
                  className="w-24 h-24 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-lg hover:text-primary">
                  <Link href={`/listings/${listing.id}`}>{listing.title}</Link>
                </h3>
                <p className="text-primary font-bold">{formatPrice(listing.price)}</p>
                <p className="text-sm text-gray-600">
                  {getCategoryLabel(listing.category)} • {listing.city} • {formatDate(listing.createdAt)}
                </p>
                <div className="mt-2 flex gap-2">
                  <Link href={`/listings/${listing.id}/edit`}>
                    <Button size="sm" variant="secondary">
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
