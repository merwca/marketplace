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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const rawImg = listing.images[0];

  const getImageUrl = (filename: string) => {
    if (!filename) return null;
    if (filename.startsWith("http")) return filename;
    return `${API_URL}/uploads/${filename}`;
  };

  const imageUrl = rawImg ? getImageUrl(rawImg) : null;

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="border rounded hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
        <div className="w-full h-40 sm:h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
          {imageUrl && !imageError ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-10">
                  <svg className="w-6 h-6 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
              <img
                src={imageUrl}
                alt={listing.title}
                className="w-full h-full object-cover transition-opacity duration-300"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1 text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs">{imageError ? "Failed to load" : "No image"}</span>
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
