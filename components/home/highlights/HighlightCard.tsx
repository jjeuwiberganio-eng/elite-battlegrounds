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
    <article
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
        hover:shadow-2xl
      "
    >
      {/* Media */}

      <div className="relative aspect-video overflow-hidden">

        <Image
          src={highlight.mediaUrl}
          alt={highlight.title}
          fill
          sizes="(max-width:768px)100vw,(max-width:1280px)50vw,33vw"
          className="
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />

        {/* Video Badge */}

        {highlight.mediaType === "video" && (
          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              bg-black/30
            "
          >
            <div
              className="
                rounded-full
                bg-white/90
                p-4
                shadow-xl
              "
            >
              <PlayCircle className="h-10 w-10 text-red-600" />
            </div>
          </div>
        )}

        {/* Featured Badge */}

        {highlight.featured && (
          <div
            className="
              absolute
              left-4
              top-4
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-amber-500
              px-3
              py-1.5
              text-xs
              font-bold
              uppercase
              tracking-wide
              text-slate-950
            "
          >
            <Star className="h-4 w-4" />

            Featured
          </div>
        )}

      </div>

      {/* Content */}

      <div className="p-6">

        <div className="flex items-center gap-2 text-sm text-slate-400">

          <CalendarDays className="h-4 w-4" />

          {new Date(
            highlight.publishedAt,
          ).toLocaleDateString()}
        </div>

        <h3 className="mt-4 text-2xl font-bold text-white transition-colors duration-300 group-hover:text-amber-400">
          {highlight.title}
        </h3>

        <p className="mt-4 line-clamp-3 leading-7 text-slate-400">
          {highlight.description}
        </p>

      </div>

      {/* Bottom Accent */}

      <div
        className="
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