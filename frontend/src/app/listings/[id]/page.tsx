"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import * as api from "@/lib/api";
import { Listing } from "@/types";
import ListingGrid from "@/components/listings/ListingGrid";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { formatPrice, formatDate, getCategoryLabel } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface ListingPageProps {
  params: { id: string };
}

export default function ListingPage({ params }: ListingPageProps) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [related, setRelated] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reported, setReported] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setIsLoading(true);
    api
      .getListing(params.id)
      .then((res: any) => {
        setListing(res.data.listing);
        setRelated(res.data.related || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [params.id]);

  const handleReport = async () => {
    try {
      const reason = prompt("Why are you reporting this listing?");
      if (!reason) return;

      await api.reportListing(params.id, reason);
      setReported(true);
      setTimeout(() => setReported(false), 5000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error || !listing) return <div className="text-center py-8 text-red-600">{error || "Not found"}</div>;

  const isOwner = user?.id === listing.userId;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          {listing.images.length > 0 ? (
            <img
              src={`${API_URL}/uploads/${listing.images[0]}`}
              alt={listing.title}
              className="w-full rounded border mb-4"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded border flex items-center justify-center mb-4">
              No image
            </div>
          )}

          {listing.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mb-4">
              {listing.images.map((img, i) => (
                <img
                  key={i}
                  src={`${API_URL}/uploads/${img}`}
                  alt={`Image ${i + 1}`}
                  className="rounded border h-20 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ))}
            </div>
          )}

          <div className="bg-white p-6 rounded border mb-6">
            <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
            <p className="text-gray-600 mb-4">
              {getCategoryLabel(listing.category)} • {listing.city} • {formatDate(listing.createdAt)}
            </p>
            <h2 className="text-2xl font-bold text-primary mb-4">{formatPrice(listing.price)}</h2>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{listing.description}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded border sticky top-4">
            <div className="mb-6 pb-6 border-b">
              <h3 className="font-bold mb-2">Seller</h3>
              <p className="text-lg font-bold mb-1">{listing.user.name}</p>
              <a
                href={`mailto:${listing.contactEmail}`}
                className="text-primary hover:underline break-all"
              >
                {listing.contactEmail}
              </a>
            </div>

            <div className="space-y-2 mb-6">
              <a
                href={`mailto:${listing.contactEmail}?subject=RE: ${encodeURIComponent(listing.title)}`}
                className="w-full block bg-primary text-white text-center py-2 rounded hover:bg-accent"
              >
                Contact Seller
              </a>

              {isOwner && (
                <>
                  <Link
                    href={`/listings/${params.id}/edit`}
                    className="w-full block border border-primary text-primary text-center py-2 rounded hover:bg-gray-50"
                  >
                    Edit
                  </Link>
                </>
              )}

              {!isOwner && (
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={handleReport}
                  disabled={reported}
                >
                  {reported ? "Reported" : "Report"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {reported && <Alert type="success" message="Thank you for reporting this listing" />}

      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Related Listings</h2>
          <ListingGrid listings={related} />
        </div>
      )}
    </div>
  );
}
