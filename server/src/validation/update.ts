import { z } from "zod";

export const updateDetail = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(40, "Name can't exceed 40 characters"),
  email: z
    .string()
    .min(5, "Email must be at least 5 characters long")
    .max(50, "Email can't exceed 50 characters")
    .email("Invalid email format"),
  location: z
    .string()
    .min(3, "Location must be at least 3 characters long")
    .max(40, "Location can't exceed 40 characters"),
  businessName: z
    .string()
    .min(0, "Invalid entity for Admins")
});
