import { z } from "zod";

const validateEmail = z.object({
  email: z
    .string()
    .min(5, "Email must be at least 5 characters long")
    .max(50, "Email can't exceed 50 characters")
    .email("Invalid email format"),
});

export default validateEmail;
