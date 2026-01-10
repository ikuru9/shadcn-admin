import * as v from "valibot";
import { createFileRoute } from "@tanstack/react-router";
import { Tasks } from "@/features/tasks";
import { priorities, statuses } from "@/features/tasks/data/data";

const taskSearchSchema = v.object({
  page: v.optional(v.number(), 1),
  pageSize: v.optional(v.number(), 10),
  status: v.optional(v.array(v.picklist(statuses.map((status) => status.value))), []),
  priority: v.optional(v.array(v.picklist(priorities.map((priority) => priority.value))), []),
  filter: v.optional(v.string(), ""),
});

export const Route = createFileRoute("/_authenticated/tasks/")({
  validateSearch: taskSearchSchema,
  component: Tasks,
});
