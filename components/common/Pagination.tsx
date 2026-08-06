"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getVisiblePages(
  current: number,
  total: number,
): (number | "...")[] {
  if (total <= 7) {
    return Array.from(
      { length: total },
      (_, i) => i + 1,
    );
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) {
    pages.push("...");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  pages.push(total);

  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: Readonly<PaginationProps>) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getVisiblePages(
    currentPage,
    totalPages,
  );

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-2"
    >
      {/* Previous */}

      <button
        type="button"
        onClick={() =>
          onPageChange(currentPage - 1)
        }
        disabled={currentPage === 1}
        className="
          inline-flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          border
          border-slate-700
          bg-slate-900
          text-slate-300
          transition
          hover:border-amber-500
          hover:text-amber-400
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Pages */}

      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-slate-500"
            >
              <MoreHorizontal className="h-5 w-5" />
            </span>
          );
        }

        const active =
          page === currentPage;

        return (
          <button
            key={page}
            type="button"
            onClick={() =>
              onPageChange(page)
            }
            aria-current={
              active ? "page" : undefined
            }
            className={[
              "h-10 w-10 rounded-xl border font-semibold transition",
              active
                ? "border-amber-500 bg-amber-500 text-slate-950"
                : "border-slate-700 bg-slate-900 text-slate-300 hover:border-amber-500 hover:text-amber-400",
            ].join(" ")}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}

      <button
        type="button"
        onClick={() =>
          onPageChange(currentPage + 1)
        }
        disabled={
          currentPage === totalPages
        }
        className="
          inline-flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          border
          border-slate-700
          bg-slate-900
          text-slate-300
          transition
          hover:border-amber-500
          hover:text-amber-400
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </nav>
  );
}