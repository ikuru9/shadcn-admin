import type { PetStatusEnumKey } from "@/gen/types/Pet";

export const petsStatuses = new Map<PetStatusEnumKey, string>([
  ["available", "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200"],
  ["pending", "bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300"],
  ["sold", "bg-neutral-300/40 border-neutral-300"],
]);
