import Image from "next/image";

interface HeroBackgroundProps {
  image: string;
}

export default function HeroBackground({
  image,
}: Readonly<HeroBackgroundProps>) {
  return (
    <>
      <div className="absolute inset-0 bg-white" />

      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="(max-width: 1023px) 100vw, 70vw"
          className="
            object-cover
            object-center
            lg:object-contain
            lg:object-right
          "
        />
      </div>

      {/* Keep the left side clean enough for the typography */}
      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          left-0
          z-[1]
          hidden
          w-[57%]
          bg-gradient-to-r
          from-white
          via-white/95
          to-transparent
          lg:block
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          z-[2]
          h-28
          bg-gradient-to-t
          from-white
          to-transparent
        "
      />
    </>
  );
}