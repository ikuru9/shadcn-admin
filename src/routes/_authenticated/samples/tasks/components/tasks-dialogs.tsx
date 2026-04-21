import { TasksImportDialog } from "./tasks-import-dialog";
import { TasksMutateDrawer } from "./tasks-mutate-drawer";
import { useTasks } from "./tasks-provider";

export function TasksDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTasks();
  return (
    <>
      <TasksMutateDrawer key="task-create" open={open === "create"} onOpenChange={() => setOpen("create")} />

      <TasksImportDialog key="tasks-import" open={open === "import"} onOpenChange={() => setOpen("import")} />

      {currentRow && (
        <TasksMutateDrawer
          key={`task-update-${currentRow.id}`}
          open={open === "update"}
          onOpenChange={() => {
            setOpen("update");
            setTimeout(() => {
              setCurrentRow(null);
            }, 500);
          }}
          currentRow={currentRow}
        />
      )}
    </>
  );
}
