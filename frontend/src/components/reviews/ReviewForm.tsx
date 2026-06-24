"use client";

import { useState } from "react";

interface ReviewFormProps {
  sellerId: string;
  listingId: string;
  onSubmit?: (rating: number, text: string) => Promise<void>;
  isSubmitting?: boolean;
}

export default function ReviewForm({ sellerId, listingId, onSubmit, isSubmitting = false }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit) return;

    try {
      await onSubmit(rating, text);
      setRating(5);
      setText("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-bold text-gray-900">Share Your Experience</h3>

      {/* Rating */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-4xl transition-colors ${star <= rating ? "text-yellow-400" : "text-gray-300 hover:text-yellow-300"}`}
            >
              ★
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-1">{rating} out of 5 stars</p>
      </div>

      {/* Review Text */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Your Review (Optional)</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your experience with this seller..."
          maxLength={500}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={4}
        />
        <p className="text-xs text-gray-600 mt-1">{text.length}/500</p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
      >
        {isSubmitting ? "Submitting..." : submitted ? "✓ Review Posted!" : "⭐ Post Review"}
      </button>
    </form>
  );
}
