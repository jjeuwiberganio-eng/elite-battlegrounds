import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface FacebookCTASectionProps {
  communityName: string;
  communityDescription: string;
}

const FACEBOOK_URL =
  "https://www.facebook.com/profile.php?id=61592289087142";

export default function FacebookCTASection({
  communityName,
  communityDescription,
}: Readonly<FacebookCTASectionProps>) {
  return (
    <section className="bg-white px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="w-full">
        <div
          className="
            grid
            items-center
            gap-4
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-4
            shadow-sm
            sm:gap-6
            sm:rounded-2xl
            sm:px-6
            sm:py-5
            md:px-8
            lg:grid-cols-[72px_minmax(0,1.2fr)_minmax(0,1fr)]
            lg:gap-8
            lg:px-10
          "
        >
          {/* Facebook Icon */}
          <div className="flex items-center justify-center lg:justify-start">
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-lg
                bg-blue-600
                shadow-sm
                sm:h-16
                sm:w-16
                sm:rounded-xl
              "
            >
              <span className="text-2xl font-black leading-none text-white sm:text-4xl">
                f
              </span>
            </div>
          </div>

          {/* Main CTA */}
          <div className="text-center lg:text-left">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-950 sm:text-sm">
              All Players Are Required To
            </p>

            <h2
              className="
                mt-1
                text-xl
                font-black
                uppercase
                italic
                leading-tight
                text-slate-950
                sm:text-3xl
                md:text-4xl
              "
            >
              Follow the{" "}
              <span className="text-amber-600">Facebook Page</span>
            </h2>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              {communityName}
            </p>

            <Link
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-2
                inline-flex
                items-center
                gap-1.5
                text-sm
                font-bold
                text-blue-600
                transition-colors
                hover:text-blue-800
                sm:gap-2
                sm:text-base
              "
            >
              Join on Facebook
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
          </div>

          {/* Announcement */}
          <div
            className="
              border-t
              border-slate-200
              pt-3
              text-center
              sm:pt-4
              lg:border-l
              lg:border-t-0
              lg:pl-8
              lg:text-left
            "
          >
            <p
              className="
                text-xs
                font-black
                uppercase
                leading-4
                text-slate-950
                sm:text-sm
                sm:leading-5
                md:text-base
                md:leading-6
              "
            >
              Upang makatanggap ng lahat ng
              <br />
              official announcements, schedules,
              <br />
              brackets, at iba pang tournament updates.
            </p>

            <p className="mt-1.5 text-[11px] leading-4 text-slate-500 sm:mt-2 sm:text-xs sm:leading-5">
              {communityDescription}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}