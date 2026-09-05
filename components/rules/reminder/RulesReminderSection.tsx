import { AlertTriangle } from "lucide-react";

interface RulesReminderSectionProps {
  tournamentName: string;
}

export default function RulesReminderSection({
  tournamentName,
}: Readonly<RulesReminderSectionProps>) {
  return (
    <section className="bg-white px-6 pb-16 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-300 text-amber-500">
            <AlertTriangle className="h-4 w-4" />
          </div>

          <p className="text-sm leading-6 text-slate-600">
            By registering and competing in {tournamentName}, all players and teams agree to follow the rules above. Violations may result in warnings, match forfeits, or disqualification at the Tournament Organizer&apos;s discretion.
          </p>
        </div>
      </div>
    </section>
  );
}
