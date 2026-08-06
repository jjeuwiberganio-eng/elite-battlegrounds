import {
  Target,
  Eye,
} from "lucide-react";

interface MissionVisionProps {
  mission: string;
  vision: string;
}

interface CardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function Card({
  title,
  description,
  icon,
}: Readonly<CardProps>) {
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
        p-10
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-amber-500/40
      "
    >
      {/* Background Glow */}

      <div
        className="
          absolute
          -right-20
          -top-20
          h-48
          w-48
          rounded-full
          bg-amber-500/10
          blur-3xl
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
      />

      <div
        className="
          relative
          flex
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

      <h2 className="relative mt-8 text-3xl font-black text-white">
        {title}
      </h2>

      <p className="relative mt-6 leading-8 text-slate-400">
        {description}
      </p>

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

export default function MissionVision({
  mission,
  vision,
}: Readonly<MissionVisionProps>) {
  return (
    <section className="bg-slate-900 py-24">

      <div className="container">

        <div className="grid gap-8 lg:grid-cols-2">

          <Card
            title="Our Mission"
            description={mission}
            icon={<Target className="h-8 w-8" />}
          />

          <Card
            title="Our Vision"
            description={vision}
            icon={<Eye className="h-8 w-8" />}
          />

        </div>

      </div>

    </section>
  );
}