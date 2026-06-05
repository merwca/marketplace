"use client";

import { useState } from "react";
import { Listing, CATEGORIES } from "@/types";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Alert from "../ui/Alert";
import ImageUpload from "./ImageUpload";

interface ListingFormProps {
  initialData?: Listing;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
}

export default function ListingForm({
  initialData,
  onSubmit,
  isLoading = false,
}: ListingFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [category, setCategory] = useState(initialData?.category || "FOR_SALE");
  const [city, setCity] = useState(initialData?.city || "");
  const [contactEmail, setContactEmail] = useState(initialData?.contactEmail || "");
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!title || !description || !category || !city || !contactEmail) {
      setError("All fields are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (price) formData.append("price", price);
      formData.append("category", category);
      formData.append("city", city);
      formData.append("contactEmail", contactEmail);

      images.forEach((file) => {
        formData.append("images", file);
      });

      await onSubmit(formData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to save listing");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      {error && <Alert type="error" message={error} onClose={() => setError("")} />}
      {success && (
        <Alert type="success" message="Listing saved successfully!" />
      )}

      <div className="bg-white p-6 rounded border">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief headline for your listing"
          maxLength={200}
        />

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Full details about your listing"
            rows={6}
            maxLength={5000}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <Input
          label="Price (optional)"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0.00"
          step="0.01"
          min="0"
        />

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g., San Francisco"
        />

        <Input
          label="Contact Email"
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          placeholder="your@email.com"
        />

        <ImageUpload onFilesSelect={setImages} />

        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Post Listing"}
          </Button>
        </div>
      </div>
    </form>
  );
}
