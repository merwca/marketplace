"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";

interface SearchBarProps {
  initialQuery?: string;
}

export default function SearchBar({ initialQuery = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search listings..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button type="submit">Search</Button>
      </div>
    </form>
  );
}
