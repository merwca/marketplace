"use client";

interface SellerRatingProps {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export default function SellerRating({ averageRating, totalReviews, ratingBreakdown }: SellerRatingProps) {
  const getColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 3.5) return "text-blue-600";
    if (rating >= 2.5) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-4">
      {/* Average Rating */}
      <div className="flex items-baseline gap-3">
        <span className={`text-4xl font-bold ${getColor(averageRating)}`}>
          {averageRating.toFixed(1)}
        </span>
        <div>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.round(averageRating) ? "text-yellow-400 text-lg" : "text-gray-300 text-lg"}>
                ★
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </p>
        </div>
      </div>

      {/* Rating Breakdown */}
      {ratingBreakdown && totalReviews > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-600 uppercase">Rating Breakdown</p>
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingBreakdown[stars as keyof typeof ratingBreakdown] || 0;
            const percentage = (count / totalReviews) * 100;
            return (
              <div key={stars} className="flex items-center gap-2">
                <span className="text-sm text-gray-600 min-w-fit">{stars}★</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400" style={{ width: `${percentage}%` }}></div>
                </div>
                <span className="text-sm text-gray-600 min-w-fit">{count}</span>
              </div>
            );
          })}
        </div>
      )}

      {totalReviews === 0 && (
        <p className="text-sm text-gray-500 italic">No reviews yet. Be the first to review this seller!</p>
      )}
    </div>
  );
}
