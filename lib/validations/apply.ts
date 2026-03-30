import { z } from "zod";

export const applyStep1Schema = z.object({
  full_name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  country: z.string().min(2, "Country required"),
  referral_source: z.string().optional(),
  account_type: z.enum(
    ["individual", "institutional", "developer", "agent", "partner"],
    { message: "Select an account type" }
  ),
});

export const applyStep2BuyerSchema = z.object({
  investment_type: z.enum(
    ["personal", "investment", "relocation", "both", "exploring"],
    { message: "Select your intent" }
  ),
  regions_interest: z
    .array(z.string())
    .min(1, "Select at least one region"),
  timeline: z.string().min(1, "Timeline required"),
  budget_range: z.string().min(1, "Budget range required"),
});

export const applyStep2PartnerSchema = z.object({
  company_name: z.string().min(2, "Company name required"),
  property_location: z.string().min(2, "Location required"),
  property_type: z.string().min(1, "Property type required"),
  portfolio_size: z.string().optional(),
  description: z.string().min(10, "Tell us about your project"),
});

export const applyStep3Schema = z.object({
  context: z.string().min(10, "Tell us what you are looking for"),
});

export type ApplyStep1Input = z.infer<typeof applyStep1Schema>;
export type ApplyStep2BuyerInput = z.infer<typeof applyStep2BuyerSchema>;
export type ApplyStep2PartnerInput = z.infer<typeof applyStep2PartnerSchema>;
export type ApplyStep3Input = z.infer<typeof applyStep3Schema>;
