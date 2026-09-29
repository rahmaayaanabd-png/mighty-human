export const INDUSTRIES = [
  "Software Engineering",
  "Product Management",
  "Data & Analytics",
  "Design",
  "Marketing",
  "Sales",
  "Finance",
  "Human Resources",
  "Operations",
  "Consulting",
  "Healthcare",
  "Education",
  "Legal",
  "Other",
] as const;

export type Industry = (typeof INDUSTRIES)[number];
