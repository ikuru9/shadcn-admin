// @vitest-environment jsdom

import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, expectTypeOf, it, vi } from "vitest";

describe("useDialog", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  async function setup() {
    const mod = await import("./use-dialog");
    const hook = renderHook(() => mod.useDialog());
    return { mod, hook };
  }

  it("openDialog는 result 타입을 추론하고 값을 resolve 한다", async () => {
    const { hook } = await setup();

    function StringDialog(_props: { onConfirm: (value: string) => void; onCancel?: () => void }) {
      return null;
    }

    const promise = hook.result.current.openDialog(StringDialog, {});

    expectTypeOf(promise).toEqualTypeOf<Promise<string>>();

    hook.result.current.closeDialog("done");

    await expect(promise).resolves.toBe("done");
  });

  it("alert는 undefined를 resolve 한다", async () => {
    const { hook } = await setup();

    const promise = hook.result.current.alert({
      title: "Notice",
      description: "Alert dialog",
      destructive: false,
      className: "sm:max-w-sm",
    });

    expectTypeOf(promise).toEqualTypeOf<Promise<undefined>>();

    hook.result.current.closeDialog();

    await expect(promise).resolves.toBeUndefined();
  });

  it("confirm는 확인 시 true, 취소 시 false를 resolve 한다", async () => {
    const { hook } = await setup();

    const promise = hook.result.current.confirm({
      title: "Confirm",
      description: "Are you sure?",
      destructive: true,
      className: "sm:max-w-sm",
    });

    expectTypeOf(promise).toEqualTypeOf<Promise<boolean>>();

    hook.result.current.closeDialog(true);

    await expect(promise).resolves.toBe(true);
  });

  it("confirm는 cancel 시 false를 resolve 한다", async () => {
    const { hook } = await setup();

    const promise = hook.result.current.confirm({
      title: "Confirm",
      description: "Are you sure?",
      destructive: true,
      className: "sm:max-w-sm",
    });

    hook.result.current.cancelDialog();

    await expect(promise).resolves.toBe(false);
  });

  it("prompt는 확인 시 입력값을 resolve 하고 cancel 시 null을 resolve 한다", async () => {
    const { hook } = await setup();

    const promptPromise = hook.result.current.prompt({
      title: "Prompt",
      description: "Type something",
      promptLabel: "Value",
      destructive: false,
      className: "sm:max-w-sm",
    });

    expectTypeOf(promptPromise).toEqualTypeOf<Promise<string | null>>();

    hook.result.current.closeDialog("typed text");

    await expect(promptPromise).resolves.toBe("typed text");

    const cancelPromise = hook.result.current.prompt({
      title: "Prompt",
      description: "Type something",
      promptLabel: "Value",
      destructive: false,
      className: "sm:max-w-sm",
    });

    hook.result.current.cancelDialog();

    await expect(cancelPromise).resolves.toBeNull();
  });
});
