import { CalendarDays } from "lucide-react";

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export default function Timeline({
  events,
}: Readonly<TimelineProps>) {
  return (
    <section className="bg-slate-950 py-24">

      <div className="container">

        <div className="mx-auto mb-20 max-w-3xl text-center">

          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-amber-400">
            Our Journey
          </span>

          <h2 className="mt-6 text-4xl font-black text-white md:text-5xl">
            The Elite Battlegrounds Story
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Every tournament helps grow our esports community. Here's
            how Elite Battlegrounds continues to evolve season after
            season.
          </p>

        </div>

        <div className="relative mx-auto max-w-5xl">

          {/* Timeline Line */}

          <div className="absolute left-6 top-0 hidden h-full w-px bg-white/10 md:block" />

          <div className="space-y-10">

            {events.map((event) => (

              <article
                key={event.id}
                className="
                  relative
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/[0.05]
                  p-8
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:border-amber-500/40
                  hover:-translate-y-1
                "
              >

                {/* Timeline Dot */}

                <div
                  className="
                    absolute
                    -left-[14px]
                    top-10
                    hidden
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    border-4
                    border-slate-950
                    bg-amber-500
                    md:flex
                  "
                />

                <div className="flex flex-wrap items-center gap-4">

                  <div
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      bg-amber-500/10
                      text-amber-400
                    "
                  >
                    <CalendarDays className="h-7 w-7" />
                  </div>

                  <div>

                    <p className="text-sm uppercase tracking-widest text-amber-400">
                      {event.year}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold text-white">
                      {event.title}
                    </h3>

                  </div>

                </div>

                <p className="mt-6 leading-8 text-slate-400">
                  {event.description}
                </p>

              </article>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
}