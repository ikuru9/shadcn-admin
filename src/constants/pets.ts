import { type PetStatus } from "@/features/samples/pets/data/schema";

export const petsStatuses = new Map<PetStatus, string>([
  ["available", "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200"],
  ["pending", "bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300"],
  ["sold", "bg-neutral-300/40 border-neutral-300"],
]);
