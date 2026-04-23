import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import * as z from "zod/mini";

import { Main } from "@/components/layout/main";
import { QueryError } from "@/components/query-error";

import { priorities, statuses } from "./components/data/data";
import { tasks } from "./components/data/tasks";
import { TasksDialogs } from "./components/tasks-dialogs";
import { TasksPrimaryButtons } from "./components/tasks-primary-buttons";
import { TasksProvider } from "./components/tasks-provider";
import { TasksTable } from "./components/tasks-table";

const statusValues = statuses.map((status) => status.value) as [
  (typeof statuses)[number]["value"],
  ...(typeof statuses)[number]["value"][],
];
const priorityValues = priorities.map((priority) => priority.value) as [
  (typeof priorities)[number]["value"],
  ...(typeof priorities)[number]["value"][],
];

const taskSearchSchema = z.object({
  page: z.optional(z.number()),
  pageSize: z.optional(z.number()),
  status: z.optional(z.array(z.enum(statusValues))),
  priority: z.optional(z.array(z.enum(priorityValues))),
  query: z.optional(z.string()),
  sort: z.optional(z.enum(["title", "status", "priority"])),
  order: z.optional(z.enum(["asc", "desc"])),
});

const route = getRouteApi("/_authenticated/samples/tasks/");

function Tasks() {
  const search = route.useSearch();
  const navigate = route.useNavigate();

  return (
    <TasksProvider>
      <Main fluid className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-bold text-2xl tracking-tight">Tasks</h2>
            <p className="text-muted-foreground">Here&apos;s a list of your tasks for this month!</p>
          </div>
          <TasksPrimaryButtons />
        </div>
        <TasksTable data={tasks} search={search} navigate={navigate} />
      </Main>

      <TasksDialogs />
    </TasksProvider>
  );
}

export const Route = createFileRoute("/_authenticated/samples/tasks/")({
  validateSearch: taskSearchSchema,
  component: Tasks,
  errorComponent: QueryError,
});
