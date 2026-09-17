"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Plus, Minus, Maximize2 } from "lucide-react";

interface MobileBracketScalerProps {
  contentWidth: number;
  contentHeight: number;
  children: React.ReactNode;
}

interface Point {
  x: number;
  y: number;
}

export default function MobileBracketScaler({
  contentWidth,
  contentHeight,
  children,
}: Readonly<MobileBracketScalerProps>) {
  const containerRef = useRef<HTMLDivElement>(null);

  // The "fit whole bracket on screen" scale - our minimum zoom level.
  const [fitScale, setFitScale] = useState(1);

  // Current zoom + pan.
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState<Point>({ x: 0, y: 0 });

  // Live refs so pointer handlers always see current values without
  // re-binding listeners on every render.
  const scaleRef = useRef(scale);
  const translateRef = useRef(translate);
  const fitScaleRef = useRef(fitScale);
  scaleRef.current = scale;
  translateRef.current = translate;
  fitScaleRef.current = fitScale;

  const maxScaleRef = useRef(1);

  // Active pointers on the canvas, keyed by pointerId.
  const pointers = useRef<Map<number, Point>>(new Map());

  // One-finger pan state.
  const panStart = useRef<{ pointer: Point; translate: Point } | null>(null);

  // Two-finger pinch state.
  const pinchStart = useRef<{
    distance: number;
    scale: number;
    anchor: Point; // content-space point under the pinch midpoint
  } | null>(null);

  const lastTap = useRef<{ time: number; x: number; y: number } | null>(
    null,
  );

  const clampTranslate = useCallback(
    (next: Point, currentScale: number) => {
      const el = containerRef.current;
      if (!el) return next;

      const availableWidth = el.offsetWidth;
      const availableHeight = el.offsetHeight;
      const scaledWidth = contentWidth * currentScale;
      const scaledHeight = contentHeight * currentScale;

      const minX = Math.min(0, availableWidth - scaledWidth);
      const minY = Math.min(0, availableHeight - scaledHeight);

      return {
        x: Math.min(0, Math.max(minX, next.x)),
        y: Math.min(0, Math.max(minY, next.y)),
      };
    },
    [contentWidth, contentHeight],
  );

  useEffect(() => {
    function updateFit() {
      if (!containerRef.current) return;

      const availableWidth = containerRef.current.offsetWidth;
      const next = Math.min(1, availableWidth / contentWidth);

      setFitScale(next);
      maxScaleRef.current = Math.max(1, next);

      // Reset to the fitted, un-panned view whenever the fit scale
      // changes (e.g. on rotation/resize) rather than leaving the
      // user zoomed into stale coordinates.
      setScale(next);
      setTranslate({ x: 0, y: 0 });
    }

    updateFit();

    window.addEventListener("resize", updateFit);
    return () => window.removeEventListener("resize", updateFit);
  }, [contentWidth]);

  const setZoom = useCallback(
    (nextScale: number, anchor?: Point) => {
      const el = containerRef.current;
      const clampedScale = Math.min(
        maxScaleRef.current,
        Math.max(fitScaleRef.current, nextScale),
      );

      if (!el) {
        setScale(clampedScale);
        return;
      }

      const anchorPoint = anchor ?? {
        x: el.offsetWidth / 2,
        y: el.offsetHeight / 2,
      };

      // Keep the content point currently under `anchorPoint` fixed
      // in place while the scale changes.
      const contentX =
        (anchorPoint.x - translateRef.current.x) / scaleRef.current;
      const contentY =
        (anchorPoint.y - translateRef.current.y) / scaleRef.current;

      const nextTranslate = clampTranslate(
        {
          x: anchorPoint.x - contentX * clampedScale,
          y: anchorPoint.y - contentY * clampedScale,
        },
        clampedScale,
      );

      setScale(clampedScale);
      setTranslate(nextTranslate);
    },
    [clampTranslate],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      containerRef.current?.setPointerCapture(e.pointerId);
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.current.size === 1) {
        panStart.current = {
          pointer: { x: e.clientX, y: e.clientY },
          translate: translateRef.current,
        };
        pinchStart.current = null;
      } else if (pointers.current.size === 2) {
        panStart.current = null;

        const pts = Array.from(pointers.current.values());
        const dx = pts[0].x - pts[1].x;
        const dy = pts[0].y - pts[1].y;
        const distance = Math.hypot(dx, dy);
        const midpoint = {
          x: (pts[0].x + pts[1].x) / 2,
          y: (pts[0].y + pts[1].y) / 2,
        };

        const el = containerRef.current;
        const rect = el?.getBoundingClientRect();
        const localMid = {
          x: midpoint.x - (rect?.left ?? 0),
          y: midpoint.y - (rect?.top ?? 0),
        };

        pinchStart.current = {
          distance,
          scale: scaleRef.current,
          anchor: {
            x: (localMid.x - translateRef.current.x) / scaleRef.current,
            y: (localMid.y - translateRef.current.y) / scaleRef.current,
          },
        };
      }
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!pointers.current.has(e.pointerId)) return;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      const el = containerRef.current;
      const rect = el?.getBoundingClientRect();

      if (pointers.current.size === 2 && pinchStart.current) {
        const pts = Array.from(pointers.current.values());
        const dx = pts[0].x - pts[1].x;
        const dy = pts[0].y - pts[1].y;
        const distance = Math.hypot(dx, dy);
        const midpoint = {
          x: (pts[0].x + pts[1].x) / 2 - (rect?.left ?? 0),
          y: (pts[0].y + pts[1].y) / 2 - (rect?.top ?? 0),
        };

        const ratio = distance / (pinchStart.current.distance || 1);
        const nextScale = Math.min(
          maxScaleRef.current,
          Math.max(fitScaleRef.current, pinchStart.current.scale * ratio),
        );

        const nextTranslate = clampTranslate(
          {
            x: midpoint.x - pinchStart.current.anchor.x * nextScale,
            y: midpoint.y - pinchStart.current.anchor.y * nextScale,
          },
          nextScale,
        );

        setScale(nextScale);
        setTranslate(nextTranslate);
      } else if (pointers.current.size === 1 && panStart.current) {
        const current = pointers.current.get(e.pointerId)!;
        const dx = current.x - panStart.current.pointer.x;
        const dy = current.y - panStart.current.pointer.y;

        const nextTranslate = clampTranslate(
          {
            x: panStart.current.translate.x + dx,
            y: panStart.current.translate.y + dy,
          },
          scaleRef.current,
        );

        setTranslate(nextTranslate);
      }
    },
    [clampTranslate],
  );

  const endPointer = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);

    if (pointers.current.size === 0) {
      panStart.current = null;
      pinchStart.current = null;
    } else if (pointers.current.size === 1) {
      // Dropped from a pinch to a single finger - restart pan from here.
      pinchStart.current = null;
      const [remaining] = Array.from(pointers.current.values());
      panStart.current = {
        pointer: remaining,
        translate: translateRef.current,
      };
    }
  }, []);

  const handleDoubleTapCheck = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== "touch") return;

      const now = Date.now();
      const last = lastTap.current;
      lastTap.current = { time: now, x: e.clientX, y: e.clientY };

      if (
        last &&
        now - last.time < 300 &&
        Math.hypot(e.clientX - last.x, e.clientY - last.y) < 30
      ) {
        const rect = containerRef.current?.getBoundingClientRect();
        const anchor = {
          x: e.clientX - (rect?.left ?? 0),
          y: e.clientY - (rect?.top ?? 0),
        };

        const isZoomedIn = scaleRef.current > fitScaleRef.current + 0.01;
        setZoom(isZoomedIn ? fitScaleRef.current : maxScaleRef.current, anchor);
        lastTap.current = null;
      }
    },
    [setZoom],
  );

  const isZoomed = scale > fitScale + 0.01;

  return (
    <div className="relative">
      <div
        ref={containerRef}
        style={{ height: contentHeight * fitScale }}
        className="w-full touch-none select-none overflow-hidden rounded-xl border border-white/10 bg-black/20"
        onPointerDown={(e) => {
          handlePointerDown(e);
          handleDoubleTapCheck(e);
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onPointerLeave={endPointer}
      >
        <div
          style={{
            width: contentWidth,
            height: contentHeight,
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            transformOrigin: "0 0",
          }}
        >
          {children}
        </div>
      </div>

      {/* Zoom controls */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-end gap-1.5 p-2">
        <div className="pointer-events-auto flex flex-col gap-1.5 rounded-lg border border-white/10 bg-black/60 p-1 backdrop-blur-sm">
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => setZoom(scale + (maxScaleRef.current - fitScale) / 3)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-white transition hover:bg-white/10 active:bg-white/20"
          >
            <Plus className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => setZoom(scale - (maxScaleRef.current - fitScale) / 3)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-white transition hover:bg-white/10 active:bg-white/20"
          >
            <Minus className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label="Reset zoom"
            onClick={() => setZoom(fitScale, { x: 0, y: 0 })}
            className="flex h-8 w-8 items-center justify-center rounded-md text-white transition hover:bg-white/10 active:bg-white/20"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {!isZoomed && (
        <p className="pointer-events-none absolute left-2 top-2 rounded-md bg-black/60 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white/70 backdrop-blur-sm">
          Pinch or tap + to zoom in
        </p>
      )}
    </div>
  );
}