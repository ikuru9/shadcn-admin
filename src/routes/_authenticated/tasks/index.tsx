import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod/mini";

import { Tasks } from "@/features/tasks";
import { priorities, statuses } from "@/features/tasks/data/data";

const statusValues = statuses.map((status) => status.value) as [
  (typeof statuses)[number]["value"],
  ...(typeof statuses)[number]["value"][],
];
const priorityValues = priorities.map((priority) => priority.value) as [
  (typeof priorities)[number]["value"],
  ...(typeof priorities)[number]["value"][],
];

const taskSearchSchema = z.object({
  page: z.prefault(z.number(), 1),
  pageSize: z.prefault(z.number(), 10),
  status: z.prefault(z.array(z.enum(statusValues)), []),
  priority: z.prefault(z.array(z.enum(priorityValues)), []),
  filter: z.prefault(z.string(), ""),
});

export const Route = createFileRoute("/_authenticated/tasks/")({
  validateSearch: taskSearchSchema,
  component: Tasks,
});
