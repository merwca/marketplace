"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/types";

export default function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentCity = searchParams.get("city") || "";
  const currentQuery = searchParams.get("q") || "";

  const updateFilters = (
    newCategory?: string,
    newCity?: string
  ) => {
    const params = new URLSearchParams();
    if (currentQuery) params.set("q", currentQuery);
    if (newCategory) params.set("category", newCategory);
    if (newCity) params.set("city", newCity);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded border mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={currentCategory}
            onChange={(e) => updateFilters(e.target.value, currentCity)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">City</label>
          <input
            type="text"
            value={currentCity}
            onChange={(e) => updateFilters(currentCategory, e.target.value)}
            placeholder="Enter city"
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
      </div>
    </div>
  );
}
