"use client";

import type { ReactNode } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  trigger?: ReactNode;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  onOpenChange,
  onConfirm,
  trigger,
}: Readonly<ConfirmDialogProps>) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
    >
      {trigger && (
        <Dialog.Trigger asChild>
          {trigger}
        </Dialog.Trigger>
      )}

      <Dialog.Portal>

        <Dialog.Overlay
          className="
            fixed
            inset-0
            z-50
            bg-black/70
            backdrop-blur-sm
          "
        />

        <Dialog.Content
          className="
            fixed
            left-1/2
            top-1/2
            z-50
            w-[92vw]
            max-w-md
            -translate-x-1/2
            -translate-y-1/2
            rounded-3xl
            border
            border-white/10
            bg-slate-900
            p-8
            shadow-2xl
            focus:outline-none
          "
        >
          {/* Close */}

          <Dialog.Close
            className="
              absolute
              right-5
              top-5
              rounded-lg
              p-2
              text-slate-400
              transition
              hover:bg-slate-800
              hover:text-white
            "
          >
            <X className="h-5 w-5" />
          </Dialog.Close>

          {/* Icon */}

          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-red-500/10
              text-red-400
            "
          >
            <AlertTriangle className="h-8 w-8" />
          </div>

          {/* Title */}

          <Dialog.Title
            className="
              mt-6
              text-2xl
              font-bold
              text-white
            "
          >
            {title}
          </Dialog.Title>

          {/* Description */}

          <Dialog.Description
            className="
              mt-4
              leading-7
              text-slate-400
            "
          >
            {description}
          </Dialog.Description>

          {/* Actions */}

          <div className="mt-8 flex justify-end gap-3">

            <Dialog.Close asChild>

              <button
                type="button"
                disabled={loading}
                className="
                  rounded-xl
                  border
                  border-slate-700
                  px-5
                  py-3
                  font-semibold
                  text-slate-300
                  transition
                  hover:bg-slate-800
                "
              >
                {cancelLabel}
              </button>

            </Dialog.Close>

            <button
              type="button"
              disabled={loading}
              onClick={onConfirm}
              className="
                rounded-xl
                bg-red-600
                px-5
                py-3
                font-semibold
                text-white
                transition
                hover:bg-red-500
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading
                ? "Processing..."
                : confirmLabel}
            </button>

          </div>

        </Dialog.Content>

      </Dialog.Portal>
    </Dialog.Root>
  );
}