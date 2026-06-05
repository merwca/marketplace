import Link from "next/link";
import { Listing } from "@/types";
import { formatPrice, formatDate, getCategoryLabel } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const imageUrl = listing.images.length > 0 ? `${API_URL}/uploads/${listing.images[0]}` : null;

  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="border rounded hover:shadow-lg transition-shadow">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={listing.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 truncate">{listing.title}</h3>
          <p className="text-xl font-bold text-primary mt-1">{formatPrice(listing.price)}</p>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{listing.description}</p>
          <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
            <span>{getCategoryLabel(listing.category)}</span>
            <span>{listing.city}</span>
            <span>{formatDate(listing.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
