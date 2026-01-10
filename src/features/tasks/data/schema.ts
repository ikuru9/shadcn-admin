import * as v from "valibot";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = v.object({
  id: v.string(),
  title: v.string(),
  status: v.string(),
  label: v.string(),
  priority: v.string(),
});

export type Task = v.InferOutput<typeof taskSchema>;
