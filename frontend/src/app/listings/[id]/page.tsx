"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import * as api from "@/lib/api";
import { Listing } from "@/types";
import ListingGrid from "@/components/listings/ListingGrid";
import ImageCarousel from "@/components/listings/ImageCarousel";
import SellerRating from "@/components/reviews/SellerRating";
import ReviewList from "@/components/reviews/ReviewList";
import ReviewForm from "@/components/reviews/ReviewForm";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { formatPrice, formatDate, getCategoryLabel } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

const API_URL = "";

interface ReviewData {
  id: string;
  rating: number;
  text?: string;
  createdAt: string;
  reviewer: {
    id: string;
    name: string;
  };
}

interface SellerStats {
  totalReviews: number;
  averageRating: number;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export default function ListingPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const [listing, setListing] = useState<Listing | null>(null);
  const [related, setRelated] = useState<Listing[]>([]);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [sellerStats, setSellerStats] = useState<SellerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [error, setError] = useState("");
  const [reported, setReported] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [reviewSubmitError, setReviewSubmitError] = useState("");
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      api.getListing(id),
    ])
      .then(([listingRes]: any) => {
        setListing(listingRes.data.listing);
        setRelated(listingRes.data.related || []);

        // Fetch reviews for the seller
        fetchSellerReviews(listingRes.data.listing.userId);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  const fetchSellerReviews = async (sellerId: string) => {
    try {
      setIsLoadingReviews(true);
      const res: any = await api.getSellerReviews(sellerId);
      setReviews(res.data.reviews);
      setSellerStats(res.data.stats);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleReport = async () => {
    try {
      const reason = prompt(t.listing.reportPrompt);
      if (!reason) return;

      await api.reportListing(id, reason);
      setReported(true);
      setTimeout(() => setReported(false), 5000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleReviewSubmit = async (rating: number, text: string) => {
    if (!listing) return;
    try {
      setReviewSubmitError("");
      await api.createReview(listing.userId, id, rating, text);

      // Refresh reviews
      await fetchSellerReviews(listing.userId);
    } catch (err: any) {
      setReviewSubmitError(err.message || "Failed to submit review");
      throw err;
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!listing) return;
    try {
      await api.deleteReview(reviewId);
      // Refresh reviews
      await fetchSellerReviews(listing.userId);
    } catch (err: any) {
      setError(err.message || "Failed to delete review");
    }
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

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-12">
        <svg className="w-12 h-12 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );

  if (error || !listing)
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
        <h2 className="text-lg font-bold text-red-800 mb-2">Listing Not Found</h2>
        <p className="text-red-700 mb-4">{error || t.common.notFound}</p>
        <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
          ← Back to Home
        </Link>
      </div>
    );

  const isOwner = user?.id === listing.userId;
  const category = getCategoryColor(listing.category);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>
        <span>›</span>
        <span className="font-medium text-gray-900">{listing.title.substring(0, 30)}...</span>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images & Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Carousel */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <ImageCarousel images={listing.images} title={listing.title} />
          </div>

          {/* Title & Price Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{listing.title}</h1>
                <div className="flex items-center gap-2">
                  <span className={`${category.bg} ${category.text} px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1`}>
                    <span>{category.emoji}</span>
                    {getCategoryLabel(listing.category)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-5xl font-bold text-blue-600 mb-1">{formatPrice(listing.price)}</p>
              <p className="text-gray-600 text-sm">Posted {formatDate(listing.createdAt)}</p>
            </div>
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-2 gap-4 bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="text-xs text-gray-600">Location</p>
                <p className="font-semibold text-gray-900">{listing.city}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-xs text-gray-600">Posted</p>
                <p className="font-semibold text-gray-900">{formatDate(listing.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Details</h2>
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              <p className="whitespace-pre-wrap">{listing.description}</p>
            </div>
          </div>
        </div>

        {/* Right Column - Seller & CTA */}
        <div className="space-y-4">
          {/* Seller Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 p-6 sticky top-4 space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-2 uppercase tracking-wide font-semibold">Seller Information</p>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {listing.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-lg text-gray-900">{listing.user.name}</p>
                  <p className="text-xs text-gray-600">Seller</p>
                </div>
              </div>
            </div>

            {/* Seller Rating */}
            {sellerStats && (
              <div className="bg-white rounded-lg border border-blue-200 p-4">
                <SellerRating
                  averageRating={sellerStats.averageRating}
                  totalReviews={sellerStats.totalReviews}
                  ratingBreakdown={sellerStats.ratingBreakdown}
                />
              </div>
            )}

            {/* Contact Button */}
            <a
              href={`mailto:${listing.contactEmail}?subject=RE: ${encodeURIComponent(listing.title)}`}
              className="w-full block bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center text-lg"
            >
              📧 Contact Seller
            </a>

            {/* Seller Email */}
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <p className="text-xs text-gray-600 mb-1">Email</p>
              <a href={`mailto:${listing.contactEmail}`} className="text-blue-600 hover:text-blue-700 font-medium break-all">
                {listing.contactEmail}
              </a>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {isOwner ? (
                <Link
                  href={`/listings/${id}/edit`}
                  className="w-full block bg-orange-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors text-center"
                >
                  ✏️ Edit Listing
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className={`w-full font-bold py-2 px-4 rounded-lg transition-colors ${
                      isSaved ? "bg-red-100 text-red-700 border border-red-300" : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {isSaved ? "❤️ Saved" : "🤍 Save Listing"}
                  </button>
                  <button
                    onClick={handleReport}
                    disabled={reported}
                    className={`w-full font-bold py-2 px-4 rounded-lg transition-colors ${
                      reported ? "bg-green-100 text-green-700 border border-green-300" : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {reported ? "✓ Reported" : "🚩 Report Listing"}
                  </button>
                </>
              )}
            </div>

            {/* Safety Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-xs font-bold text-yellow-800 mb-2">💡 Safety Tips</p>
              <ul className="text-xs text-yellow-800 space-y-1">
                <li>• Meet in a safe place</li>
                <li>• Check the item before paying</li>
                <li>• Never wire money or use gift cards</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {reported && <Alert type="success" message={t.listing.reportedThanks} />}

      {/* Reviews Section */}
      {listing && (
        <div className="pt-8 border-t space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">⭐ Seller Reviews</h2>

            {/* Review Form for Non-Owners */}
            {isAuthenticated && !isOwner && (
              <div className="mb-8">
                <ReviewForm
                  sellerId={listing.userId}
                  listingId={id}
                  onSubmit={handleReviewSubmit}
                  isSubmitting={isLoadingReviews}
                />
                {reviewSubmitError && (
                  <Alert type="error" message={reviewSubmitError} />
                )}
              </div>
            )}

            {/* Reviews List */}
            {isLoadingReviews ? (
              <div className="text-center py-8">
                <svg className="w-8 h-8 text-blue-600 animate-spin mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : reviews.length > 0 ? (
              <ReviewList
                reviews={reviews}
                onDeleteReview={handleDeleteReview}
                currentUserId={user?.id}
              />
            ) : (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-600 text-lg mb-3">No reviews yet</p>
                <p className="text-gray-500">Be the first to review this seller!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Related Listings */}
      {related.length > 0 && (
        <div className="pt-8 border-t">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Similar Listings</h2>
          <ListingGrid listings={related} />
        </div>
      )}
    </div>
  );
}
