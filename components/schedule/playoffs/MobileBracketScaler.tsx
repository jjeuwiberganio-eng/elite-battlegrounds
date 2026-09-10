"use client";

import { useEffect, useRef, useState } from "react";

interface MobileBracketScalerProps {
  contentWidth: number;
  contentHeight: number;
  children: React.ReactNode;
}

export default function MobileBracketScaler({
  contentWidth,
  contentHeight,
  children,
}: Readonly<MobileBracketScalerProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function updateScale() {
      if (!containerRef.current) {
        return;
      }

      const availableWidth =
        containerRef.current.offsetWidth;

      const nextScale = Math.min(
        1,
        availableWidth / contentWidth,
      );

      setScale(nextScale);
    }

    updateScale();

    window.addEventListener(
      "resize",
      updateScale,
    );

    return () =>
      window.removeEventListener(
        "resize",
        updateScale,
      );
  }, [contentWidth]);

  return (
    <div
      ref={containerRef}
      style={{
        height: contentHeight * scale,
      }}
      className="w-full overflow-hidden"
    >
      <div
        style={{
          width: contentWidth,
          height: contentHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}