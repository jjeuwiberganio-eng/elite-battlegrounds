import { Crown } from "lucide-react";

interface MissionVisionSectionProps {
  mission: string;
  vision: string;
}

export default function MissionVisionSection({
  mission,
  vision,
}: Readonly<MissionVisionSectionProps>) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="text-center">
          <Crown className="mx-auto h-8 w-8 text-amber-500" />

          <h3 className="mt-3 text-lg font-black uppercase tracking-wide text-slate-900">
            Our Mission
          </h3>

          <div className="mx-auto mt-2 h-px w-10 bg-amber-400" />

          <p className="mt-4 text-sm leading-6 text-slate-600">
            {mission}
          </p>
        </div>

        <div className="text-center">
          <Crown className="mx-auto h-8 w-8 text-amber-500" />

          <h3 className="mt-3 text-lg font-black uppercase tracking-wide text-slate-900">
            Our Vision
          </h3>

          <div className="mx-auto mt-2 h-px w-10 bg-amber-400" />

          <p className="mt-4 text-sm leading-6 text-slate-600">
            {vision}
          </p>
        </div>
      </div>
    </div>
  );
}
