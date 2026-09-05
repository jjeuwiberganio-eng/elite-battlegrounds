import {
  Calendar,
  Trophy,
  Shield,
  Megaphone,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  calendar: Calendar,
  trophy: Trophy,
  shield: Shield,
  megaphone: Megaphone,
};

interface ExpectationsSectionProps {
  expectations: {
    id: string;
    title: string;
    description: string;
    icon: string;
  }[];
}

export default function ExpectationsSection({
  expectations,
}: Readonly<ExpectationsSectionProps>) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-amber-200" />

        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500">
          What To Expect
        </h2>

        <div className="h-px flex-1 bg-amber-200" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {expectations.map((item) => {
          const Icon =
            ICONS[item.icon] ??
            Trophy;

          return (
            <div
              key={item.id}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center"
            >
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                <Icon className="h-5 w-5" />
              </div>

              <p className="mt-3 text-xs font-black uppercase leading-tight tracking-wide text-slate-900">
                {item.title}
              </p>

              <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
