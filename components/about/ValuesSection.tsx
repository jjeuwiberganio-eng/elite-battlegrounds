import {
  Handshake,
  Shield,
  Trophy,
  Users,
  Star,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  handshake: Handshake,
  shield: Shield,
  trophy: Trophy,
  users: Users,
  star: Star,
};

interface ValuesSectionProps {
  values: {
    id: string;
    title: string;
    description: string;
    icon: string;
  }[];
}

export default function ValuesSection({
  values,
}: Readonly<ValuesSectionProps>) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-amber-200" />

        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500">
          Our Values
        </h2>

        <div className="h-px flex-1 bg-amber-200" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {values.map((value) => {
          const Icon =
            ICONS[value.icon] ?? Star;

          return (
            <div
              key={value.id}
              className="text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                <Icon className="h-6 w-6" />
              </div>

              <p className="mt-3 text-xs font-black uppercase tracking-wide text-slate-900">
                {value.title}
              </p>

              <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
                {value.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
