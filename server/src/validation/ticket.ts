import { z } from "zod";

const ticketSchema = z.object({
  category: z
    .string()
    .min(3, "Category must be at least 3 characters")
    .max(25, "Category cannot exceed 25 characters"),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title cannot exceed 200 characters"),
  message: z
    .string()
    .min(3, "Message must be at least 3 characters")
    .max(1000, "Message cannot exceed 1000 characters"),
  location: z
    .string()
    .min(3, "Location must be at least 3 characters long")
    .max(40, "Location can't exceed 40 characters"),
});

export default ticketSchema;
