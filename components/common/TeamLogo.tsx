import Image from "next/image";
import { Shield } from "lucide-react";

interface TeamLogoProps {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const sizeClasses = {
  sm: "h-10 w-10",
  md: "h-14 w-14",
  lg: "h-20 w-20",
  xl: "h-28 w-28",
  "2xl": "h-36 w-36",
};

export default function TeamLogo({
  src,
  alt,
  size = "lg",
}: Readonly<TeamLogoProps>) {
  const dimension = sizeClasses[size];

  return (
    <div
      className={[
        "relative",
        dimension,
        "overflow-hidden",
        "rounded-2xl",
        "border",
        "border-white/10",
        "bg-slate-900",
        "shadow-lg",
      ].join(" ")}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="144px"
          className="object-contain p-2"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-slate-800">
          <Shield className="h-1/2 w-1/2 text-slate-500" />
        </div>
      )}
    </div>
  );
}