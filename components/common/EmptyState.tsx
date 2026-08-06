import type { ReactNode } from "react";

import {
  Inbox,
  SearchX,
  FolderOpen,
} from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: "default" | "search" | "folder";
  action?: ReactNode;
}

const icons = {
  default: Inbox,
  search: SearchX,
  folder: FolderOpen,
};

export default function EmptyState({
  title,
  description,
  icon = "default",
  action,
}: Readonly<EmptyStateProps>) {
  const Icon = icons[icon];

  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-3xl
        border
        border-dashed
        border-slate-700
        bg-slate-900/30
        px-8
        py-20
        text-center
      "
    >
      <div
        className="
          flex
          h-20
          w-20
          items-center
          justify-center
          rounded-full
          bg-slate-800
          text-slate-400
        "
      >
        <Icon className="h-10 w-10" />
      </div>

      <h3 className="mt-8 text-2xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-4 max-w-lg leading-7 text-slate-400">
        {description}
      </p>

      {action && (
        <div className="mt-8">
          {action}
        </div>
      )}
    </div>
  );
}