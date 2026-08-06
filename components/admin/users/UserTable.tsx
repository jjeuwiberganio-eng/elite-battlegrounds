"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

import DataTable, {
  type DataTableColumn,
} from "@/components/common/DataTable";
import StatusBadge from "@/components/common/StatusBadge";

export interface AdminUser {
  id: string;

  name: string;

  email: string;

  role:
    | "super_admin"
    | "admin"
    | "referee"
    | "shoutcaster";

  status: "active" | "inactive";

  lastLogin?: string | null;

  createdAt: string;
}

interface UserTableProps {
  users: AdminUser[];

  loading?: boolean;

  onDelete: (user: AdminUser) => void;
}

const roleLabels: Record<
  AdminUser["role"],
  string
> = {
  super_admin: "Super Admin",
  admin: "Admin",
  referee: "Referee",
  shoutcaster: "Shoutcaster",
};

export default function UserTable({
  users,
  loading = false,
  onDelete,
}: Readonly<UserTableProps>) {
  const columns: DataTableColumn<AdminUser>[] = [
    {
      key: "name",
      header: "Name",
      render: (user) => (
        <div>
          <div className="font-semibold text-white">
            {user.name}
          </div>

          <div className="text-sm text-slate-400">
            {user.email}
          </div>
        </div>
      ),
    },

    {
      key: "role",
      header: "Role",
      render: (user) => (
        <span
          className="
            rounded-full
            bg-amber-500/10
            px-3
            py-1
            text-xs
            font-bold
            uppercase
            tracking-wider
            text-amber-400
          "
        >
          {roleLabels[user.role]}
        </span>
      ),
    },

    {
      key: "status",
      header: "Status",
      render: (user) => (
        <StatusBadge
          status={user.status}
        />
      ),
    },

    {
      key: "lastLogin",
      header: "Last Login",
      render: (user) =>
        user.lastLogin
          ? new Date(
              user.lastLogin,
            ).toLocaleString()
          : "Never",
    },

    {
      key: "createdAt",
      header: "Created",
      render: (user) =>
        new Date(
          user.createdAt,
        ).toLocaleDateString(),
    },

    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (user) => (
        <div className="flex justify-end gap-2">

          <Link
            href={`/admin/users/${user.id}`}
            className="
              rounded-xl
              border
              border-slate-700
              p-2
              text-slate-300
              transition
              hover:border-cyan-500
              hover:text-cyan-400
            "
            aria-label={`View ${user.name}`}
          >
            <Eye className="h-5 w-5" />
          </Link>

          <Link
            href={`/admin/users/${user.id}/edit`}
            className="
              rounded-xl
              border
              border-slate-700
              p-2
              text-slate-300
              transition
              hover:border-amber-500
              hover:text-amber-400
            "
            aria-label={`Edit ${user.name}`}
          >
            <Pencil className="h-5 w-5" />
          </Link>

          <button
            type="button"
            onClick={() => onDelete(user)}
            className="
              rounded-xl
              border
              border-slate-700
              p-2
              text-slate-300
              transition
              hover:border-red-500
              hover:text-red-400
            "
            aria-label={`Delete ${user.name}`}
          >
            <Trash2 className="h-5 w-5" />
          </button>

        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={users}
      columns={columns}
      loading={loading}
      rowKey={(user) => user.id}
      emptyTitle="No Users Found"
      emptyDescription="Administrator and staff accounts will appear here."
    />
  );
}