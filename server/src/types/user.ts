import { z } from "zod";
import {
  userSignupInputSchema,
  userLoginInputSchema,
} from "../validation/user";

export type UserSignupData = z.infer<typeof userSignupInputSchema>;

export type UserLoginData = z.infer<typeof userLoginInputSchema>;
