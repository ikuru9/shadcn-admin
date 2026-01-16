import { AlertDialog, type AlertDialogProps } from "@/components/dialogs/alert-dialog";
import { ConfirmDialog, type ConfirmDialogProps } from "@/components/dialogs/confirm-dialog";
import { createStore, useStore } from "@/lib/store";

// 컴포넌트 타입에서 Props 타입 추출
export type ComponentProps<T> = T extends React.ComponentType<infer P> ? P : never;

// 컴포넌트의 전체 Props 타입에서 onClose의 파라미터 타입 추출
// biome-ignore lint/suspicious/noExplicitAny: 라이브러리 타입 정의가 불분명함
export type InferDialogResult<TComponent extends React.ComponentType<any>> =
  ComponentProps<TComponent> extends { onClose(result: infer R): void }
    ? R
    : ComponentProps<TComponent> extends { onClose?: (result: infer R) => void }
      ? R
      : boolean; // 기본적으로 boolean (확인/취소 다이얼로그용)

export interface DialogStateItem {
  // biome-ignore lint/suspicious/noExplicitAny: 라이브러리 타입 정의가 불분명함
  component: React.ComponentType<any> | null;
  // biome-ignore lint/suspicious/noExplicitAny: 라이브러리 타입 정의가 불분명함
  props: any;
  open: boolean;
  isAlertDialog?: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: 라이브러리 타입 정의가 불분명함
  resolve: ((value: any) => void) | null;
  // biome-ignore lint/suspicious/noExplicitAny: 라이브러리 타입 정의가 불분명함
  reject: ((reason?: any) => void) | null;
}

const initialState = new Map<string, DialogStateItem>();

const dialogStore = createStore(initialState);

interface DialogWrapperProps {
  className?: string;
}

// biome-ignore lint/suspicious/noExplicitAny: 라이브러리 타입 정의가 불분명함
function openDialog<TComponent extends React.ComponentType<any>>(
  component: TComponent,
  props: Omit<ComponentProps<TComponent>, "onClose" | "onCancel"> & DialogWrapperProps,
): Promise<InferDialogResult<TComponent>> {
  return new Promise<InferDialogResult<TComponent>>((resolve, reject) => {
    dialogStore.setState((prevState) => {
      const key = Date.now().toString();
      const newDialogs = new Map(prevState);
      newDialogs.set(key, {
        component,
        props,
        open: true,
        // biome-ignore lint/suspicious/noExplicitAny: 라이브러리 타입 정의가 불분명함
        resolve: resolve as (value: any) => void,
        reject,
      });
      return newDialogs;
    });
  });
}

function alert(props: Omit<AlertDialogProps, "onClose" | "onCancel"> & DialogWrapperProps) {
  return new Promise<InferDialogResult<typeof AlertDialog>>((resolve, reject) => {
    dialogStore.setState((prevState) => {
      const key = Date.now().toString();
      const newDialogs = new Map(prevState);
      newDialogs.set(key, {
        component: AlertDialog,
        props,
        open: true,
        isAlertDialog: true,
        // biome-ignore lint/suspicious/noExplicitAny: 라이브러리 타입 정의가 불분명함
        resolve: resolve as (value: any) => void,
        reject,
      });
      return newDialogs;
    });
  });
}

function confirm(props: Omit<ConfirmDialogProps, "onClose" | "onCancel"> & DialogWrapperProps) {
  return new Promise<InferDialogResult<typeof ConfirmDialog>>((resolve, reject) => {
    dialogStore.setState((prevState) => {
      const key = Date.now().toString();
      const newDialogs = new Map(prevState);
      newDialogs.set(key, {
        component: ConfirmDialog,
        props,
        open: true,
        isAlertDialog: true,
        // biome-ignore lint/suspicious/noExplicitAny: 라이브러리 타입 정의가 불분명함
        resolve: resolve as (value: any) => void,
        reject,
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
      if (lastDialog?.reject) {
        lastDialog.reject(reason);
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
          isAlertDialog: false,
          resolve: null,
          reject: null,
        }
      : {
          component: null,
          props: {},
          open: false,
          isAlertDialog: false,
          resolve: null,
          reject: null,
        };

  return {
    ...current,
    alert,
    confirm,
    openDialog,
    closeDialog,
    cancelDialog,
    dialogs: store,
  };
}
