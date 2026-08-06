import Image from "next/image";
import { ShieldCheck } from "lucide-react";

export interface Organizer {
  id: string;
  name: string;
  role: string;
  photo?: string | null;
  bio?: string;
}

interface OrganizersProps {
  organizers: Organizer[];
}

export default function Organizers({
  organizers,
}: Readonly<OrganizersProps>) {
  return (
    <section className="bg-slate-900 py-24">

      <div className="container">

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-amber-400">
            Meet The Team
          </span>

          <h2 className="mt-6 text-4xl font-black text-white md:text-5xl">
            Tournament Organizers
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Behind every successful tournament is a dedicated team working
            to provide a fair, organized, and enjoyable competitive
            experience for every participant.
          </p>

        </div>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">

          {organizers.map((organizer) => (

            <article
              key={organizer.id}
              className="
                group
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                bg-white/[0.05]
                backdrop-blur-xl
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-amber-500/40
              "
            >

              <div className="relative aspect-square">

                {organizer.photo ? (

                  <Image
                    src={organizer.photo}
                    alt={organizer.name}
                    fill
                    sizes="(max-width:768px)100vw,(max-width:1280px)50vw,25vw"
                    className="
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-105
                    "
                  />

                ) : (

                  <div className="flex h-full items-center justify-center bg-slate-800">

                    <ShieldCheck className="h-20 w-20 text-slate-600" />

                  </div>

                )}

              </div>

              <div className="p-6">

                <h3 className="text-2xl font-bold text-white">
                  {organizer.name}
                </h3>

                <p className="mt-2 font-semibold text-amber-400">
                  {organizer.role}
                </p>

                {organizer.bio && (

                  <p className="mt-5 line-clamp-4 leading-7 text-slate-400">
                    {organizer.bio}
                  </p>

                )}

              </div>

            </article>

          ))}

        </div>

      </div>

    </section>
  );
}