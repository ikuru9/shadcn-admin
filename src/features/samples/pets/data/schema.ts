import * as z from "zod/mini";

const categorySchema = z.optional(
  z.object({
    id: z.optional(z.number()),
    name: z.optional(z.string()),
  }),
);

const tagSchema = z.optional(
  z.object({
    id: z.optional(z.number()),
    name: z.optional(z.string()),
  }),
);

const petStatusSchema = z.optional(z.union([z.literal("available"), z.literal("pending"), z.literal("sold")]));

const petSchema = z.object({
  id: z.optional(z.number()),
  name: z.string(),
  category: categorySchema,
  photoUrls: z.array(z.string()),
  tags: z.optional(z.array(tagSchema)),
  status: petStatusSchema,
});

export type Pet = z.infer<typeof petSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Tag = z.infer<typeof tagSchema>;
export type PetStatus = z.infer<typeof petStatusSchema>;

export const petListSchema = z.array(petSchema);
