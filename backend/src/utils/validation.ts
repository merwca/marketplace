import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createListingSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(5000),
  price: z.string().optional(),
  category: z.enum([
    "FOR_SALE",
    "HOUSING",
    "JOBS",
    "SERVICES",
    "COMMUNITY",
    "VEHICLES",
    "ELECTRONICS",
  ]),
  city: z.string().min(2).max(100),
  contactEmail: z.string().email(),
});

export const updateListingSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  description: z.string().min(10).max(5000).optional(),
  price: z.string().optional(),
  category: z
    .enum([
      "FOR_SALE",
      "HOUSING",
      "JOBS",
      "SERVICES",
      "COMMUNITY",
      "VEHICLES",
      "ELECTRONICS",
    ])
    .optional(),
  city: z.string().min(2).max(100).optional(),
  contactEmail: z.string().email().optional(),
});

export const reportSchema = z.object({
  reason: z.string().min(10).max(500),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
});
