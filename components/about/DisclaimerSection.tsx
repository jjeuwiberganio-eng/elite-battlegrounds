import { AlertTriangle } from "lucide-react";

interface DisclaimerSectionProps {
  disclaimer: string;
}

export default function DisclaimerSection({
  disclaimer,
}: Readonly<DisclaimerSectionProps>) {
  return (
    <section className="bg-white px-6 pb-10 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-300 text-amber-500">
            <AlertTriangle className="h-4 w-4" />
          </div>

          <p className="text-sm leading-6 text-slate-600">
            {disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
