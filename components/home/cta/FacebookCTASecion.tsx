import Link from "next/link";
import { Facebook, ArrowRight } from "lucide-react";

interface FacebookCTASectionProps {
  facebookUrl: string;
  communityName: string;
  communityDescription: string;
}

export default function FacebookCTASection({
  facebookUrl,
  communityName,
  communityDescription,
}: Readonly<FacebookCTASectionProps>) {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-24">

      {/* Background Glow */}
      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[500px]
          w-[500px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-amber-500/10
          blur-3xl
        "
      />

      <div className="container relative z-10">

        <div
          className="
            overflow-hidden
            rounded-[32px]
            border
            border-white/10
            bg-gradient-to-br
            from-slate-900
            via-slate-900
            to-slate-950
            p-10
            shadow-2xl
            lg:p-16
          "
        >

          <div className="mx-auto max-w-4xl text-center">

            <div
              className="
                mx-auto
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-blue-600
                shadow-xl
              "
            >
              <Facebook className="h-10 w-10 text-white" />
            </div>

            <h2 className="mt-8 text-4xl font-black text-white md:text-5xl">
              Join Our Community
            </h2>

            <h3 className="mt-4 text-xl font-bold text-amber-400">
              {communityName}
            </h3>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              {communityDescription}
            </p>

            <div className="mt-10">

              <Link
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex
                  items-center
                  gap-3
                  rounded-2xl
                  bg-blue-600
                  px-8
                  py-4
                  text-lg
                  font-bold
                  text-white
                  transition-all
                  duration-300
                  hover:scale-[1.03]
                  hover:bg-blue-500
                  hover:shadow-xl
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:ring-offset-2
                  focus:ring-offset-slate-950
                "
              >
                Join on Facebook

                <ArrowRight className="h-5 w-5" />

              </Link>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}