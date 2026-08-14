import type { ReactNode } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export default function FeatureCard({
  title,
  description,
  icon,
}: Readonly<FeatureCardProps>) {
  return (
   <article
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-8
        shadow-md
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* Glow Effect */}
      <div
        className="
          absolute
          -right-16
          -top-16
          h-40
          w-40
          rounded-full
          bg-amber-50
          blur-3xl
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
      />

      {/* Icon */}
      <div
        className="
          relative
          z-10
          inline-flex
          h-16
          w-16
          items-center
          justify-center
          rounded-2xl
          bg-amber-100
          text-amber-400
          transition-all
          duration-300
          group-hover:bg-amber-500
          group-hover:text-slate-950
        "
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="relative z-10 mt-8 text-2xl font-bold text-slate-900">
        {title}
      </h3>

      {/* Description */}
      <p className="relative z-10 mt-4 leading-7 text-slate-600">
        {description}
      </p>

      {/* Bottom Accent */}
      <div
        className="
          absolute
          bottom-0
          left-0
          h-1
          w-0
          bg-amber-500
          transition-all
          duration-300
          group-hover:w-full
        "
      />
    </article>
  );
}