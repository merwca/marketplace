"use client";

import { useState } from "react";
import Link from "next/link";
import { Listing } from "@/types";
import { formatPrice } from "@/lib/utils";

// Get image URL base - supports multiple deployment scenarios
const getImageBase = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return "";
};

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
    const base = getImageBase();
    return `${base}/uploads/${filename}`;
  };

  const imageUrl = rawImg ? getImageUrl(rawImg) : null;

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, { bg: string; text: string; emoji: string }> = {
      FOR_SALE: { bg: "bg-blue-100", text: "text-blue-800", emoji: "🛍️" },
      HOUSING: { bg: "bg-green-100", text: "text-green-800", emoji: "🏠" },
      JOBS: { bg: "bg-purple-100", text: "text-purple-800", emoji: "💼" },
      SERVICES: { bg: "bg-orange-100", text: "text-orange-800", emoji: "🔧" },
      COMMUNITY: { bg: "bg-pink-100", text: "text-pink-800", emoji: "👥" },
      VEHICLES: { bg: "bg-red-100", text: "text-red-800", emoji: "🚗" },
      ELECTRONICS: { bg: "bg-indigo-100", text: "text-indigo-800", emoji: "📱" },
    };
    return colors[category] || colors.FOR_SALE;
  };

  const category = getCategoryColor(listing.category);

  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="group bg-white border border-gray-200 rounded-lg hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col">
        {/* Image Container */}
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
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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

          {/* Category Badge */}
          <div className={`absolute top-3 right-3 ${category.bg} ${category.text} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}>
            <span>{category.emoji}</span>
            <span>New</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Price */}
          <p className="text-lg sm:text-xl font-bold text-blue-600 mb-2">{formatPrice(listing.price)}</p>

          {/* Title */}
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
            {listing.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{listing.city}</span>
          </div>

          {/* CTA Button */}
          <button className="mt-auto w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
}
