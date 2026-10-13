"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

import ConfirmDialog from "@/components/common/ConfirmDialog";

interface ConfirmOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

type ConfirmFn = (
  options: ConfirmOptions,
) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

/*
 * Drop-in replacement for window.confirm():
 *
 *   const confirm = useConfirm();
 *   if (!(await confirm({ title, description }))) return;
 *
 * Resolves true on confirm, false on cancel / close / Escape.
 */
export function ConfirmProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [options, setOptions] =
    useState<ConfirmOptions | null>(null);

  const resolverRef = useRef<
    ((value: boolean) => void) | null
  >(null);

  const confirm = useCallback<ConfirmFn>((next) => {
    return new Promise<boolean>((resolve) => {
      /* A newer request cancels any one still open. */
      resolverRef.current?.(false);
      resolverRef.current = resolve;
      setOptions(next);
    });
  }, []);

  const settle = useCallback((value: boolean) => {
    resolverRef.current?.(value);
    resolverRef.current = null;
    setOptions(null);
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      <ConfirmDialog
        open={options !== null}
        title={options?.title ?? ""}
        description={options?.description ?? ""}
        confirmLabel={options?.confirmLabel ?? "Confirm"}
        cancelLabel={options?.cancelLabel ?? "Cancel"}
        onOpenChange={(open) => {
          if (!open) {
            settle(false);
          }
        }}
        onConfirm={() => settle(true)}
      />
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const confirm = useContext(ConfirmContext);

  if (!confirm) {
    throw new Error(
      "useConfirm must be used inside <ConfirmProvider>.",
    );
  }

  return confirm;
}
