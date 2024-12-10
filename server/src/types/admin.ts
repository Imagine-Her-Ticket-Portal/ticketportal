import { z } from "zod";
import {
  adminLoginInputSchema,
  adminSignupInputSchema,
} from "../validation/admin";

export type AdminSignupData = z.infer<typeof adminSignupInputSchema>;

export type AdminLoginData = z.infer<typeof adminLoginInputSchema>;
