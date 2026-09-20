"use client";

import { useState } from "react";
import Image from "next/image";
import {
  PlayCircle,
  Star,
  X,
} from "lucide-react";

interface Highlight {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  url: string;
  featured: boolean;
  publishedAt: string;
}

interface HighlightCardProps {
  highlight: Highlight;
}

export default function HighlightCard({
  highlight,
}: Readonly<HighlightCardProps>) {
  const isVideo =
    highlight.mediaType === "video";

  const [modalOpen, setModalOpen] =
    useState(false);

  const wrapperProps = {
    type: "button" as const,
    onClick: () => setModalOpen(true),
  };

  return (
    <>
      <button
        {...wrapperProps}
        className="group relative min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-950 text-left"
      >
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
          {isVideo && (
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

            {isVideo && (
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
      </button>

      {isVideo && modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() =>
            setModalOpen(false)
          }
        >
          <div
            className="flex max-h-[90vh] max-w-[90vw] justify-center"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div
              className="relative"
              style={{
                display: "inline-block",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setModalOpen(false)
                }
                className="absolute -top-11 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>

              <video
                src={highlight.url}
                controls
                autoPlay
                className="rounded-xl bg-black"
                style={{
                  display: "block",
                  maxHeight: "80vh",
                  maxWidth: "85vw",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                }}
              />

              <p className="mt-3 text-center text-sm font-bold uppercase tracking-wide text-white">
                {highlight.title}
              </p>
            </div>
          </div>
        </div>
      )}

      {!isVideo && modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() =>
            setModalOpen(false)
          }
        >
          <div
            className="flex max-h-[90vh] max-w-[90vw] justify-center"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div
              className="relative"
              style={{
                display: "inline-block",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setModalOpen(false)
                }
                className="absolute -top-11 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>

              {/* eslint-disable-next-line @next/next/no-img-element -- modal shows the image at its natural size, capped by viewport, same as the video element above */}
              <img
                src={highlight.mediaUrl}
                alt={highlight.title}
                className="rounded-xl"
                style={{
                  display: "block",
                  maxHeight: "80vh",
                  maxWidth: "85vw",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                }}
              />

              <p className="mt-3 text-center text-sm font-bold uppercase tracking-wide text-white">
                {highlight.title}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}