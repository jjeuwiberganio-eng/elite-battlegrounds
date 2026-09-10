import Image from "next/image";

interface TeamLogoProps {
  src: string | null;
  alt: string;
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = {
  sm: 32,
  md: 44,
  lg: 64,
};

export default function TeamLogo({
  src,
  alt,
  size = "md",
}: Readonly<TeamLogoProps>) {
  const pixelSize = SIZE_MAP[size];

  if (!src) {
    return (
      <div
        style={{
          width: pixelSize,
          height: pixelSize,
        }}
        className="flex shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-400"
      >
        {alt.slice(0, 2)}
      </div>
    );
  }

  return (
    <div
      style={{
        width: pixelSize,
        height: pixelSize,
      }}
      className="relative shrink-0"
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${pixelSize}px`}
        className="object-contain"
      />
    </div>
  );
}