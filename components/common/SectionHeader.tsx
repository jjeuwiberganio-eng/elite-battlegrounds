import type { ReactNode } from "react";

interface SectionHeaderProps {
  badge?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
}

export default function SectionHeader({
  badge,
  title,
  description,
  action,
  align = "left",
}: Readonly<SectionHeaderProps>) {
  const centered = align === "center";

  return (
    <div
      className={[
        "mb-14",
        "flex",
        "flex-col",
        "gap-6",
        centered
          ? "items-center text-center"
          : "lg:flex-row lg:items-end lg:justify-between",
      ].join(" ")}
    >
      <div
        className={[
          centered && "max-w-3xl",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {badge && (
          <span
            className="
              inline-flex
              rounded-full
              border
              border-amber-500/40
              bg-amber-500/10
              px-4
              py-2
              text-sm
              font-semibold
              uppercase
              tracking-wider
              text-amber-400
            "
          >
            {badge}
          </span>
        )}

        <h2
          className="
            mt-5
            text-4xl
            font-black
            leading-tight
            text-white
            md:text-5xl
          "
        >
          {title}
        </h2>

        {description && (
          <p
            className={[
              "mt-5",
              "text-lg",
              "leading-8",
              "text-slate-400",
              centered ? "mx-auto max-w-2xl" : "max-w-2xl",
            ].join(" ")}
          >
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}