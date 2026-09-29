import { z } from "zod";
import { INDUSTRIES } from "@/lib/industries";

export const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  headline: z.string().trim().max(140).optional().or(z.literal("")),
  currentRole: z.string().trim().max(100).optional().or(z.literal("")),
  industry: z.enum(INDUSTRIES).optional().or(z.literal("")),
  bio: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const postSchema = z
  .object({
    type: z.enum(["EXPERIENCE", "RESOURCE"]),
    title: z.string().trim().min(1, "Title is required").max(140),
    body: z.string().trim().min(1, "Details are required").max(5000),
    industry: z.enum(INDUSTRIES),
    openToChat: z.boolean().default(false),
    resourceUrl: z
      .string()
      .trim()
      .url("Enter a valid URL")
      .optional()
      .or(z.literal("")),
    resourceKind: z
      .enum(["ARTICLE", "VIDEO", "PODCAST", "TOOL", "OTHER"])
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => data.type !== "RESOURCE" || !!data.resourceUrl,
    { message: "A link is required for resources", path: ["resourceUrl"] },
  );
