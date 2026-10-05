import { z } from "zod";

export const projectRequestSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name."),
  email: z.string().trim().email("Enter a valid email address."),
  company: z.string().trim().min(2, "Enter a company or organisation."),
  projectType: z.string().min(1, "Select a project type."),
  budget: z.string().min(1, "Select a budget range."),
  timeline: z.string().min(1, "Select a timeline."),
  description: z.string().trim().min(30, "Tell us at least a little more about the project.").max(3000)
});

export type ProjectRequestInput = z.infer<typeof projectRequestSchema>;
