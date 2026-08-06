import Image from "next/image";

interface HeroBackgroundProps {
  image: string;
}

export default function HeroBackground({
  image,
}: Readonly<HeroBackgroundProps>) {
  return (
    <>
      {/* Background Image */}
      <div className="absolute inset-0 -z-20">

        <Image
          src={image}
          alt="Elite Battlegrounds Hero Background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 -z-10 bg-black/70" />

      {/* Top Gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/90" />

      {/* Left Gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />

      {/* Bottom Glow */}
      <div
        className="
          absolute
          bottom-0
          left-1/2
          -z-10
          h-64
          w-[42rem]
          -translate-x-1/2
          rounded-full
          bg-amber-500/10
          blur-3xl
        "
      />

      {/* Decorative Blur */}
      <div
        className="
          absolute
          right-0
          top-0
          -z-10
          h-80
          w-80
          rounded-full
          bg-red-500/10
          blur-3xl
        "
      />

      {/* Noise Overlay */}
      <div
        className="
          absolute
          inset-0
          -z-10
          opacity-[0.04]
          [background-image:radial-gradient(circle,white_1px,transparent_1px)]
          [background-size:24px_24px]
        "
      />
    </>
  );
}