import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: "USER" | "ADMIN";
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: "USER" | "ADMIN";
  };
}

export interface CreateListingInput {
  title: string;
  description: string;
  price?: number;
  category: string;
  city: string;
  contactEmail: string;
}

export interface UpdateListingInput {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  city?: string;
  contactEmail?: string;
}

export interface CreateReportInput {
  reason: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
}
