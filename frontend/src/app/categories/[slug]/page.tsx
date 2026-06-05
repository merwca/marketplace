"use client";

import { useEffect, useState } from "react";
import * as api from "@/lib/api";
import { Listing, Category, CATEGORIES } from "@/types";
import ListingGrid from "@/components/listings/ListingGrid";
import { getCategoryLabel } from "@/lib/utils";

interface CategoryPageProps {
  params: { slug: string };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const category = params.slug.toUpperCase().replace(/-/g, "_") as Category;
  const categoryLabel = getCategoryLabel(category);

  useEffect(() => {
    setIsLoading(true);
    api
      .getListings({ category })
      .then((res: any) => setListings(res.data.listings))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [category]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{categoryLabel}</h1>
      <p className="text-gray-600 mb-6">Browsing {categoryLabel.toLowerCase()}</p>

      <ListingGrid listings={listings} isLoading={isLoading} />
    </div>
  );
}
