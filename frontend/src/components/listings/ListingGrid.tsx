"use client";

import { Listing } from "@/types";
import ListingCard from "./ListingCard";

interface ListingGridProps {
  listings: Listing[];
  isLoading?: boolean;
}

export default function ListingGrid({ listings, isLoading = false }: ListingGridProps) {
  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (listings.length === 0) {
    return <div className="text-center py-8 text-gray-600">No listings found</div>;
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
