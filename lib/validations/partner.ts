import { z } from "zod";

export const partnerApplicationSchema = z.object({
  full_name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  company_name: z.string().min(2, "Company name required"),
  property_location: z.string().min(2, "Location required"),
  property_type: z.string().min(1, "Property type required"),
  asking_price: z.string().optional(),
  project_status: z.string().min(1, "Status required"),
  description: z.string().min(10, "Description required"),
});

export type PartnerApplicationInput = z.infer<typeof partnerApplicationSchema>;
