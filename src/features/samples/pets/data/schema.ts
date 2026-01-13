import * as v from "valibot";

const categorySchema = v.optional(
  v.object({
    id: v.optional(v.number()),
    name: v.optional(v.string()),
  }),
);

const tagSchema = v.optional(
  v.object({
    id: v.optional(v.number()),
    name: v.optional(v.string()),
  }),
);

const petStatusSchema = v.optional(
  v.union([v.literal("available"), v.literal("pending"), v.literal("sold")]),
);

const petSchema = v.object({
  id: v.optional(v.number()),
  name: v.string(),
  category: categorySchema,
  photoUrls: v.array(v.string()),
  tags: v.optional(v.array(tagSchema)),
  status: petStatusSchema,
});

export type Pet = v.InferOutput<typeof petSchema>;
export type Category = v.InferOutput<typeof categorySchema>;
export type Tag = v.InferOutput<typeof tagSchema>;
export type PetStatus = v.InferOutput<typeof petStatusSchema>;

export const petListSchema = v.array(petSchema);
