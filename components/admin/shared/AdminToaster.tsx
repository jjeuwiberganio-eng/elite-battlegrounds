"use client";

import { Toaster } from "sonner";

/*
 * One toaster for the whole admin area. Mounted once in
 * app/admin/layout.tsx; call toast.success() / toast.error() anywhere.
 */
export default function AdminToaster() {
  return (
    <Toaster
      theme="dark"
      position="top-right"
      richColors
      closeButton
      duration={4000}
    />
  );
}
