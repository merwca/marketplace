"use client";

import { useState } from "react";

interface Review {
  id: string;
  rating: number;
  text?: string;
  createdAt: string;
  reviewer: {
    id: string;
    name: string;
  };
}

interface ReviewListProps {
  reviews: Review[];
  onDeleteReview?: (reviewId: string) => void;
  currentUserId?: string;
}

export default function ReviewList({ reviews, onDeleteReview, currentUserId }: ReviewListProps) {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-semibold text-gray-900">{review.reviewer.name}</p>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">{review.rating}/5</span>
              </div>
            </div>

            {currentUserId === review.reviewer.id && onDeleteReview && (
              <button
                onClick={() => onDeleteReview(review.id)}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Delete
              </button>
            )}
          </div>

          {review.text && (
            <p className="text-gray-700 text-sm mb-2">{review.text}</p>
          )}

          <p className="text-xs text-gray-500">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
