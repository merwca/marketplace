export interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number | null;
  category: Category;
  city: string;
  images: string[];
  contactEmail: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export type Category =
  | "FOR_SALE"
  | "HOUSING"
  | "JOBS"
  | "SERVICES"
  | "COMMUNITY"
  | "VEHICLES"
  | "ELECTRONICS";

export const CATEGORIES: { label: string; value: Category }[] = [
  { label: "For Sale", value: "FOR_SALE" },
  { label: "Housing", value: "HOUSING" },
  { label: "Jobs", value: "JOBS" },
  { label: "Services", value: "SERVICES" },
  { label: "Community", value: "COMMUNITY" },
  { label: "Vehicles", value: "VEHICLES" },
  { label: "Electronics", value: "ELECTRONICS" },
];

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
