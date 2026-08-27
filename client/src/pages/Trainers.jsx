import SectionHeading from "../components/SectionHeading";
import TrainerCard from "../components/TrainerCard";
import Reveal from "../components/Reveal";
import { TRAINERS, IMAGES } from "../data/siteData";

export default function Trainers() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
        <SectionHeading
          eyebrow="The Coaching Floor"
          title="Coached by international powerlifters."
          body="Every coach on the floor competes and trains in powerlifting themselves — so the coaching you get on your squat, bench and deadlift comes from people who've stood under the bar at competition level."
        />
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TRAINERS.map((trainer, i) => (
            <TrainerCard key={trainer.id} index={i} {...trainer} />
          ))}
        </div>
        <Reveal delay={0.2} className="mt-8 border border-dashed border-line-strong p-6 text-sm text-steel">
          Trainer names, photos and individual competition records go here — this roster is placeholder
          copy ready to be swapped for the real bios.
        </Reveal>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto grid max-w-7xl md:grid-cols-2">
          <Reveal className="relative min-h-[280px] overflow-hidden md:min-h-[420px]">
            <img src={IMAGES.personalTraining} alt="Coach spotting a member during a set" className="h-full w-full object-cover" />
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col justify-center gap-4 bg-panel p-8 sm:p-14">
            <span className="text-stencil text-xs font-bold text-plate-yellow">Coaching Standard</span>
            <h2 className="text-display text-3xl leading-tight sm:text-4xl">
              Competition-level cues, every session.
            </h2>
            <p className="text-base leading-relaxed text-steel">
              Bar path, bracing, setup, lockout — the same details that matter on a competition platform
              get corrected on the training floor, whether you're brand new to lifting or chasing a
              personal best.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
