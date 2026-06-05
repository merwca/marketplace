"use client";

import { useState } from "react";

interface ImageUploadProps {
  onFilesSelect: (files: File[]) => void;
}

export default function ImageUpload({ onFilesSelect }: ImageUploadProps) {
  const [preview, setPreview] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate file count
    if (files.length > 3) {
      alert("Maximum 3 images allowed");
      return;
    }

    // Validate file sizes and types
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }
    }

    onFilesSelect(files);

    // Create previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Images (max 3, 5MB each)</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded"
      />
      {preview.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {preview.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Preview ${i + 1}`}
              className="w-full h-20 object-cover rounded border"
            />
          ))}
        </div>
      )}
    </div>
  );
}
