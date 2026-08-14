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
    <section className="bg-white px-6 py-6 lg:px-8">
      <div className="w-full">
        <div
          className="
            grid
            items-center
            gap-6
            rounded-2xl
            border
            border-slate-200
            bg-white
            px-6
            py-5
            shadow-sm
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
                h-16
                w-16
                items-center
                justify-center
                rounded-xl
                bg-blue-600
                shadow-sm
              "
            >
              <span className="text-4xl font-black leading-none text-white">
                f
              </span>
            </div>
          </div>

          {/* Main CTA */}
          <div className="text-center lg:text-left">
            <p className="text-sm font-bold uppercase tracking-wide text-slate-950">
              All Players Are Required To
            </p>

            <h2
              className="
                mt-1
                text-3xl
                font-black
                uppercase
                italic
                leading-tight
                text-slate-950
                md:text-4xl
              "
            >
              Follow the{" "}
              <span className="text-amber-600">Facebook Page</span>
            </h2>

            <p className="mt-1 text-sm text-slate-500">
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
                gap-2
                font-bold
                text-blue-600
                transition-colors
                hover:text-blue-800
              "
            >
              Join on Facebook
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Announcement */}
          <div
            className="
              border-t
              border-slate-200
              pt-4
              text-center
              lg:border-l
              lg:border-t-0
              lg:pl-8
              lg:text-left
            "
          >
            <p
              className="
                text-sm
                font-black
                uppercase
                leading-5
                text-slate-950
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

            <p className="mt-2 text-xs leading-5 text-slate-500">
              {communityDescription}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}