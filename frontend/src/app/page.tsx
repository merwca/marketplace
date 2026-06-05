"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import * as api from "@/lib/api";
import { Listing, CATEGORIES } from "@/types";
import ListingGrid from "@/components/listings/ListingGrid";
import SearchBar from "@/components/search/SearchBar";
import Link from "next/link";

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const category = searchParams.get("category");
    const city = searchParams.get("city");

    setIsLoading(true);
    api
      .getListings({
        category: category || undefined,
        city: city || undefined,
        limit: 12,
      })
      .then((res: any) => setListings(res.data.listings))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [searchParams]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">marketplace</h1>
        <p className="text-gray-600">Fast. Simple. Focused on what matters.</p>
      </div>

      <SearchBar />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.value}
            href={`/?category=${cat.value}`}
            className="p-4 border rounded text-center hover:bg-gray-50 hover:border-primary"
          >
            {cat.label}
          </Link>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4">Latest Listings</h2>
      <ListingGrid listings={listings} isLoading={isLoading} />
    </div>
  );
}
