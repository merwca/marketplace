"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import * as api from "@/lib/api";
import { Listing } from "@/types";
import ListingGrid from "@/components/listings/ListingGrid";
import SearchBar from "@/components/search/SearchBar";
import FilterPanel from "@/components/search/FilterPanel";

export default function SearchPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  const query = searchParams.get("q") || "";
  const category = searchParams.get("category");
  const city = searchParams.get("city");

  useEffect(() => {
    setIsLoading(true);
    api
      .getListings({
        q: query || undefined,
        category: category || undefined,
        city: city || undefined,
      })
      .then((res: any) => setListings(res.data.listings))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [query, category, city]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      <SearchBar initialQuery={query} />
      <FilterPanel />

      <div className="mb-4">
        <p className="text-gray-600">
          {listings.length} result{listings.length !== 1 ? "s" : ""} found
          {query && ` for "${query}"`}
        </p>
      </div>

      <ListingGrid listings={listings} isLoading={isLoading} />
    </div>
  );
}
