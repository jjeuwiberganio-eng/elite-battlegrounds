export default function FooterDisclaimer() {
  return (
    <section>

      <h3 className="mb-5 text-lg font-bold text-white">
        Tournament Disclaimer
      </h3>

      <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <p className="text-sm leading-7 text-slate-300">
          Elite Battlegrounds Series is an independent community tournament
          and is not affiliated with, sponsored by, or endorsed by
          Moonton Games.
        </p>

        <p className="text-sm leading-7 text-slate-300">
          Mobile Legends: Bang Bang and all related names, logos,
          game assets, characters, and trademarks are the property
          of their respective owners.
        </p>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">

          <p className="text-xs font-medium leading-6 text-amber-200">
            Elite Battlegrounds Series is organized solely for
            community entertainment and competitive esports.
            All tournament branding is original and does not
            represent any official partnership with Moonton Games.
          </p>

        </div>

      </div>

    </section>
  );
}