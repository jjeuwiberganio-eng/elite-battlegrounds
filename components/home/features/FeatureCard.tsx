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
        border-white/10
        bg-white/[0.04]
        p-8
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-amber-500/40
        hover:bg-white/[0.06]
        hover:shadow-2xl
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
          bg-amber-500/10
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
          bg-amber-500/10
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
      <h3 className="relative z-10 mt-8 text-2xl font-bold text-white">
        {title}
      </h3>

      {/* Description */}
      <p className="relative z-10 mt-4 leading-7 text-slate-400">
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