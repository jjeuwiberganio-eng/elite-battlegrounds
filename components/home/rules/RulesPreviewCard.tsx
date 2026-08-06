import { ShieldCheck } from "lucide-react";

interface Rule {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface RulePreviewCardProps {
  rule: Rule;
}

export default function RulePreviewCard({
  rule,
}: Readonly<RulePreviewCardProps>) {
  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/[0.05]
        p-8
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-amber-500/40
        hover:shadow-2xl
      "
    >
      {/* Background Glow */}

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

      {/* Category */}

      <div className="relative z-10 flex items-center gap-3">

        <div
          className="
            flex
            h-12
            w-12
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
          <ShieldCheck className="h-6 w-6" />
        </div>

        <span
          className="
            rounded-full
            border
            border-amber-500/30
            bg-amber-500/10
            px-3
            py-1
            text-xs
            font-bold
            uppercase
            tracking-wide
            text-amber-400
          "
        >
          {rule.category}
        </span>

      </div>

      {/* Title */}

      <h3
        className="
          relative
          z-10
          mt-8
          text-2xl
          font-bold
          text-white
          transition-colors
          duration-300
          group-hover:text-amber-400
        "
      >
        {rule.title}
      </h3>

      {/* Description */}

      <p
        className="
          relative
          z-10
          mt-5
          line-clamp-4
          leading-7
          text-slate-400
        "
      >
        {rule.description}
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