export function formatPrice(price: number | null): string {
  if (!price) return "Contact for price";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    FOR_SALE: "For Sale",
    HOUSING: "Housing",
    JOBS: "Jobs",
    SERVICES: "Services",
    COMMUNITY: "Community",
    VEHICLES: "Vehicles",
    ELECTRONICS: "Electronics",
  };
  return labels[category] || category;
}
