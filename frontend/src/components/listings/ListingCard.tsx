"use client";

import { useState } from "react";
import Link from "next/link";
import { Listing } from "@/types";
import { formatPrice } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [imageError, setImageError] = useState(false);
  const rawImg = listing.images[0];

  const getImageUrl = (filename: string) => {
    if (!filename) return null;
    if (filename.startsWith("http")) return filename;
    return `${API_URL}/uploads/${filename}`;
  };

  const imageUrl = rawImg ? getImageUrl(rawImg) : null;

  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="border rounded hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
        <div className="w-full h-40 sm:h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={listing.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-1 text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs">No image</span>
            </div>
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
