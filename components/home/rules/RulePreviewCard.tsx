import {
  CheckCircle2,
  Clock3,
  Handshake,
  ShieldCheck,
  ShieldX,
  XCircle,
} from "lucide-react";

interface Rule {
  title: string;
  description: string;
  icon: string;
}

interface RulePreviewCardProps {
  rule: Rule;
}

function getRuleIcon(icon: string) {
  switch (icon) {
    case "clock":
      return Clock3;

    case "x-circle":
      return XCircle;

    case "shield-x":
      return ShieldX;

    case "handshake":
      return Handshake;

    case "clipboard":
      return CheckCircle2;

    default:
      return ShieldCheck;
  }
}

export default function RulePreviewCard({
  rule,
}: Readonly<RulePreviewCardProps>) {
  const Icon = getRuleIcon(rule.icon);

  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-xl
        border
        border-slate-200
        bg-white
        p-3
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-amber-400
        hover:shadow-xl
        sm:rounded-2xl
        sm:min-h-[150px]
        sm:p-6
      "
    >
      {/* Icon */}
      <div
        className="
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-lg
          bg-amber-100
          text-amber-600
          transition
          duration-300
          group-hover:bg-amber-400
          group-hover:text-slate-950
          sm:h-11
          sm:w-11
          sm:rounded-xl
        "
      >
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>

      {/* Title */}
      <h3
        className="
          mt-2.5
          text-xs
          font-black
          uppercase
          leading-tight
          text-slate-950
          transition-colors
          duration-300
          group-hover:text-amber-600
          sm:mt-5
          sm:text-lg
        "
      >
        {rule.title}
      </h3>

      {/* Description */}
      <p className="mt-1.5 text-[11px] leading-4 text-slate-500 sm:mt-3 sm:text-sm sm:leading-6">
        {rule.description}
      </p>

      {/* Bottom accent */}
      <div
        className="
          absolute
          bottom-0
          left-0
          h-1
          w-0
          bg-amber-400
          transition-all
          duration-300
          group-hover:w-full
        "
      />
    </article>
  );
}