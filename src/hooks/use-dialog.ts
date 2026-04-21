import { AlertDialog, type AlertDialogProps } from "@/components/dialogs/alert-dialog";
import { ConfirmDialog, type ConfirmDialogProps } from "@/components/dialogs/confirm-dialog";
import { PromptDialog, type PromptDialogProps } from "@/components/dialogs/prompt-dialog";
import { createStore, useStore } from "@/lib/store";

// 컴포넌트 타입에서 Props 타입 추출
export type ComponentProps<T> = T extends React.ComponentType<infer P> ? P : never;

// 컴포넌트의 전체 Props 타입에서 onConfirm의 파라미터 타입 추출
// biome-ignore lint/suspicious/noExplicitAny: 라이브러리 타입 정의가 불분명함
export type InferDialogResult<TComponent extends React.ComponentType<any>> =
  ComponentProps<TComponent> extends { onConfirm: (...args: infer R) => void }
    ? R extends [infer T]
      ? T
      : undefined
    : ComponentProps<TComponent> extends { onConfirm?: (...args: infer R) => void }
      ? R extends [infer T]
        ? T
        : undefined
      : undefined;

type DialogSurface = "dialog" | "alert";

export interface DialogStateItem {
  // biome-ignore lint/suspicious/noExplicitAny: 라이브러리 타입 정의가 불분명함
  component: React.ComponentType<any> | null;
  // biome-ignore lint/suspicious/noExplicitAny: 라이브러리 타입 정의가 불분명함
  props: any;
  open: boolean;
  surface: DialogSurface;
  cancelValue?: unknown;
  // biome-ignore lint/suspicious/noExplicitAny: 라이브러리 타입 정의가 불분명함
  resolve: ((value: any) => void) | null;
}

const initialState = new Map<string, DialogStateItem>();

const dialogStore = createStore(initialState);

interface DialogWrapperProps {
  className?: string;
}

let dialogId = 0;

function createDialogKey() {
  dialogId += 1;
  return `${Date.now()}-${dialogId}`;
}

// biome-ignore lint/suspicious/noExplicitAny: 라이브러리 타입 정의가 불분명함
function openDialog<TComponent extends React.ComponentType<any>>(
  component: TComponent,
  props: Omit<ComponentProps<TComponent>, "onConfirm" | "onCancel"> & DialogWrapperProps,
): Promise<InferDialogResult<TComponent>> {
  return new Promise<InferDialogResult<TComponent>>((resolve) => {
    dialogStore.setState((prevState) => {
      const key = createDialogKey();
      const newDialogs = new Map(prevState);
      newDialogs.set(key, {
        component,
        props,
        open: true,
        surface: "dialog",
        // biome-ignore lint/suspicious/noExplicitAny: 라이브러리 타입 정의가 불분명함
        resolve: resolve as (value: any) => void,
      });
      return newDialogs;
    });
  });
}

function alert(props: Omit<AlertDialogProps, "onConfirm" | "onCancel"> & DialogWrapperProps) {
  return new Promise<InferDialogResult<typeof AlertDialog>>((resolve) => {
    dialogStore.setState((prevState) => {
      const key = createDialogKey();
      const newDialogs = new Map(prevState);
      newDialogs.set(key, {
        component: AlertDialog,
        props,
        open: true,
        surface: "alert",
        // biome-ignore lint/suspicious/noExplicitAny: 라이브러리 타입 정의가 불분명함
        resolve: resolve as (value: any) => void,
      });
      return newDialogs;
    });
  });
}

function confirm(props: Omit<ConfirmDialogProps, "onConfirm" | "onCancel"> & DialogWrapperProps) {
  return new Promise<InferDialogResult<typeof ConfirmDialog>>((resolve) => {
    dialogStore.setState((prevState) => {
      const key = createDialogKey();
      const newDialogs = new Map(prevState);
      newDialogs.set(key, {
        component: ConfirmDialog,
        props,
        open: true,
        surface: "alert",
        cancelValue: false,
        // biome-ignore lint/suspicious/noExplicitAny: 라이브러리 타입 정의가 불분명함
        resolve: resolve as (value: any) => void,
      });
      return newDialogs;
    });
  });
}

function prompt(props: Omit<PromptDialogProps, "onConfirm" | "onCancel"> & DialogWrapperProps) {
  return new Promise<string | null>((resolve) => {
    dialogStore.setState((prevState) => {
      const key = createDialogKey();
      const newDialogs = new Map(prevState);
      newDialogs.set(key, {
        component: PromptDialog,
        props,
        open: true,
        surface: "dialog",
        cancelValue: null,
        resolve,
      });
      return newDialogs;
    });
  });
}

// biome-ignore lint/suspicious/noExplicitAny: 라이브러리 타입 정의가 불분명함
function closeDialog(result?: any) {
  dialogStore.setState((prevState) => {
    const newDialogs = new Map(prevState);
    const keys = Array.from(newDialogs.keys());
    if (keys.length > 0) {
      const lastKey = keys[keys.length - 1];
      const lastDialog = newDialogs.get(lastKey);
      if (lastDialog?.resolve) {
        lastDialog.resolve(result);
      }
      newDialogs.delete(lastKey);
    }
    return newDialogs;
  });
}

// biome-ignore lint/suspicious/noExplicitAny: 라이브러리 타입 정의가 불분명함
export function cancelDialog(reason?: any) {
  dialogStore.setState((prevState) => {
    const newDialogs = new Map(prevState);
    const keys = Array.from(newDialogs.keys());
    if (keys.length > 0) {
      const lastKey = keys[keys.length - 1];
      const lastDialog = newDialogs.get(lastKey);
      if (lastDialog?.resolve) {
        lastDialog.resolve(reason ?? lastDialog.cancelValue);
      }
      newDialogs.delete(lastKey);
    }
    return newDialogs;
  });
}

export function useDialog() {
  const store = useStore(dialogStore);

  const keys = Array.from(store.keys());
  const current =
    keys.length > 0
      ? store.get(keys[keys.length - 1]) || {
          component: null,
          props: {},
          open: false,
          surface: "dialog" as const,
          cancelValue: undefined,
          resolve: null,
        }
      : {
          component: null,
          props: {},
          open: false,
          surface: "dialog" as const,
          cancelValue: undefined,
          resolve: null,
        };

  return {
    ...current,
    alert,
    confirm,
    prompt,
    openDialog,
    closeDialog,
    cancelDialog,
    dialogs: store,
  };
}
