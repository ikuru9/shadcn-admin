import { useSyncExternalStore } from "react";

export type MantineStoreSubscriber<Value> = (value: Value) => void;
type SetStateCallback<Value> = (value: Value) => Value;

export interface MantineStore<Value> {
  getState: () => Value;
  setState: (value: Value | SetStateCallback<Value>) => void;
  updateState: (value: Value | SetStateCallback<Value>) => void;
  initialize: (value: Value) => void;
  subscribe: (callback: MantineStoreSubscriber<Value>) => () => void;
}

// biome-ignore lint/suspicious/noExplicitAny: 라이브러리 타입 정의가 불분명함
export type MantineStoreValue<Store extends MantineStore<any>> = ReturnType<Store["getState"]>;

// biome-ignore lint/suspicious/noExplicitAny: 라이브러리 타입 정의가 불분명함
export function createStore<Value extends Record<string, any>>(initialState: Value): MantineStore<Value> {
  let state = initialState;
  let initialized = false;
  const listeners = new Set<MantineStoreSubscriber<Value>>();

  return {
    getState() {
      return state;
    },

    updateState(value) {
      state = typeof value === "function" ? value(state) : value;
    },

    setState(value) {
      this.updateState(value);
      listeners.forEach((listener) => {
        listener(state);
      });
    },

    initialize(value) {
      if (!initialized) {
        state = value;
        initialized = true;
      }
    },

    subscribe(callback) {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
  };
}
// biome-ignore lint/suspicious/noExplicitAny: 라이브러리 타입 정의가 불분명함
export function useStore<Store extends MantineStore<any>>(store: Store) {
  return useSyncExternalStore<MantineStoreValue<Store>>(
    store.subscribe,
    () => store.getState(),
    () => store.getState(),
  );
}
