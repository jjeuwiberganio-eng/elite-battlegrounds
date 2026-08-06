"use client";

import { useEffect, useState } from "react";

export function useScrollPosition(
  threshold = 0,
): boolean {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    // Set initial value
    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, [threshold]);

  return isScrolled;
}