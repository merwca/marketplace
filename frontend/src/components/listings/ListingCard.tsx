"use client";

import Link from "next/link";
import { Listing } from "@/types";
import { formatPrice } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const rawImg = listing.images[0];

  const getImageUrl = (filename: string) => {
    if (!filename) return null;
    if (filename.startsWith("http")) return filename;
    const url = `${API_URL}/uploads/${filename}`;
    console.log("Image URL:", url, "API_URL:", API_URL, "filename:", filename);
    return url;
  };

  const imageUrl = rawImg ? getImageUrl(rawImg) : null;
  console.log("ListingCard - rawImg:", rawImg, "imageUrl:", imageUrl, "API_URL:", API_URL);

  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="border rounded hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
        <div className="w-full h-40 sm:h-48 bg-gray-200 flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={listing.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <span className="text-gray-500 text-sm">No image</span>
          )}
        </div>
        <div className="p-3 sm:p-4">
          <p className="text-lg sm:text-xl font-bold text-primary">{formatPrice(listing.price)}</p>
          <h3 className="font-bold text-sm sm:text-base text-gray-900 truncate mt-1">{listing.title}</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">{listing.city}</p>
        </div>
      </div>
    </Link>
  );
}
