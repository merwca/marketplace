"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import * as api from "@/lib/api";
import { Listing, CATEGORIES } from "@/types";
import { useI18n } from "@/lib/i18n";
import ListingGrid from "@/components/listings/ListingGrid";
import SearchBar from "@/components/search/SearchBar";
import Link from "next/link";

function HomeContent() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useI18n();
  const searchParams = useSearchParams();

  useEffect(() => {
    const category = searchParams.get("category");
    const city = searchParams.get("city");

    setIsLoading(true);
    api
      .getListings({ category: category || undefined, city: city || undefined, limit: 12 })
      .then((res: any) => setListings(res.data.listings))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [searchParams]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative -mx-3 md:-mx-4 -mt-6 md:-mt-8 mb-8">
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-4 md:px-8 py-12 md:py-16 rounded-lg shadow-lg">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Find What You Need</h1>
            <p className="text-blue-100 mb-6 text-lg">Browse thousands of listings or post your own</p>

            <form onSubmit={handleHeroSearch} className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                Search
              </button>
            </form>

            <p className="text-blue-100 text-sm">Popular categories:</p>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href={`/?category=${cat.value}`}
              className="group p-4 bg-white border-2 border-gray-100 rounded-lg text-center hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="text-2xl mb-2">
                {cat.value === "FOR_SALE" && "🛍️"}
                {cat.value === "HOUSING" && "🏠"}
                {cat.value === "JOBS" && "💼"}
                {cat.value === "SERVICES" && "🔧"}
                {cat.value === "COMMUNITY" && "👥"}
                {cat.value === "VEHICLES" && "🚗"}
                {cat.value === "ELECTRONICS" && "📱"}
              </div>
              <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {t.categories[cat.value]}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Listings Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">{t.home.latestListings}</h2>
          <Link
            href="/search"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View all →
          </Link>
        </div>
        <ListingGrid listings={listings} isLoading={isLoading} />
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
