import Image from "next/image";
import {
  CalendarDays,
  PlayCircle,
  Star,
} from "lucide-react";

interface Highlight {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  featured: boolean;
  publishedAt: string;
}

interface HighlightCardProps {
  highlight: Highlight;
}

export default function HighlightCard({
  highlight,
}: Readonly<HighlightCardProps>) {
  return (
<article className="group relative min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
      {/* Media */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl">

        <Image
          src={highlight.mediaUrl}
          alt={highlight.title}
          fill
          sizes="(max-width: 768px) 33vw, 25vw"
          className="
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />

        {/* Dark gradient */}
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-32
            bg-gradient-to-t
            from-slate-950
            via-slate-950/70
            to-transparent
          "
        />

        {/* Video Play Button */}
        {highlight.mediaType === "video" && (
          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                border-2
                border-white
                bg-slate-950/50
                text-white
                shadow-xl
                backdrop-blur-sm
                transition-all
                duration-300
                group-hover:scale-110
                group-hover:bg-amber-400
                group-hover:text-slate-950
              "
            >
              <PlayCircle className="h-7 w-7" />
            </div>
          </div>
        )}

        {/* Featured */}
        {highlight.featured && (
          <div
            className="
              absolute
              left-3
              top-3
              inline-flex
              items-center
              gap-1.5
              rounded-full
              bg-amber-400
              px-2.5
              py-1
              text-[10px]
              font-black
              uppercase
              tracking-wide
              text-slate-950
            "
          >
            <Star className="h-3 w-3" />
            Featured
          </div>
        )}

        {/* Bottom Content */}
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">

          <h3
            className="
              text-sm
              font-black
              uppercase
              leading-tight
              text-white
              sm:text-base
            "
          >
            {highlight.title}
          </h3>

          {highlight.mediaType === "video" && (
            <div className="mt-1 text-[10px] font-bold uppercase tracking-wide text-amber-400">
              Short Video
            </div>
          )}

        </div>
      </div>

      {/* Hover Accent */}
      <div
        className="
          absolute
          bottom-0
          left-0
          h-1
          w-0
          bg-amber-400
          transition-all
          duration-300
          group-hover:w-full
        "
      />
    </article>
  );
}