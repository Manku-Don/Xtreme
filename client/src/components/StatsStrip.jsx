import Reveal from "./Reveal";
import { STATS } from "../data/siteData";

export default function StatsStrip() {
  return (
    <div className="relative border-y border-line bg-panel/60">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-line sm:grid-cols-4 sm:divide-y-0">
        {STATS.map((stat, i) => (
          <Reveal
            key={stat.label}
            delay={i * 0.06}
            className="flex flex-col items-center gap-1 px-4 py-6 text-center"
          >
            <span className="text-display text-3xl text-chalk sm:text-4xl">{stat.value}</span>
            <span className="text-stencil text-[0.65rem] font-bold tracking-[0.16em] text-steel">
              {stat.label}
            </span>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
