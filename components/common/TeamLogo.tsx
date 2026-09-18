import Image from "next/image";

interface TeamLogoProps {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const SIZE_MAP = {
  sm: 32,
  md: 44,
  lg: 64,
  xl: 88,
  "2xl": 112,
};

// Curated, brand-compatible gradients for teams without a logo uploaded
// yet - a colored initials badge reads far more like a real team crest
// than a flat gray placeholder circle.
const FALLBACK_GRADIENTS = [
  "from-amber-500 to-orange-600",
  "from-slate-700 to-slate-900",
  "from-blue-500 to-indigo-600",
  "from-rose-500 to-red-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
];

function gradientForName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return FALLBACK_GRADIENTS[Math.abs(hash) % FALLBACK_GRADIENTS.length];
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
}

export default function TeamLogo({
  src,
  alt,
  size = "md",
}: Readonly<TeamLogoProps>) {
  const pixelSize = SIZE_MAP[size];
  const radius = Math.round(pixelSize * 0.28);

  if (!src) {
    return (
      <div
        style={{
          width: pixelSize,
          height: pixelSize,
          borderRadius: radius,
        }}
        className={`flex shrink-0 items-center justify-center bg-gradient-to-br shadow-sm ${gradientForName(
          alt,
        )}`}
      >
        <span
          style={{ fontSize: Math.max(10, Math.round(pixelSize * 0.34)) }}
          className="font-black uppercase text-white"
        >
          {getInitials(alt)}
        </span>
      </div>
    );
  }

  const padding = Math.round(pixelSize * 0.12);

  return (
    <div
      style={{
        width: pixelSize,
        height: pixelSize,
        borderRadius: radius,
      }}
      className="shrink-0 overflow-hidden bg-slate-50 shadow-sm ring-1 ring-slate-300/70"
    >
      <div
        style={{ padding }}
        className="relative h-full w-full"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${pixelSize}px`}
          className="object-contain"
        />
      </div>
    </div>
  );
}