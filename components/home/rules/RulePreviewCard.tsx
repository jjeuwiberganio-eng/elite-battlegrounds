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
        rounded-2xl
        border
        border-slate-200
        bg-white
        min-h-[150px] p-6
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-amber-400
        hover:shadow-xl
      "
    >
      {/* Icon */}
      <div
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          bg-amber-100
          text-amber-600
          transition
          duration-300
          group-hover:bg-amber-400
          group-hover:text-slate-950
        "
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* Title */}
      <h3
        className="
          mt-5
          text-lg
          font-black
          uppercase
          leading-tight
          text-slate-950
          transition-colors
          duration-300
          group-hover:text-amber-600
        "
      >
        {rule.title}
      </h3>

      {/* Description */}
      <p className="mt-3 text-sm leading-6 text-slate-500">
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