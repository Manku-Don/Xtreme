import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import WhyUsCard from "../components/WhyUsCard";
import Button from "../components/Button";
import { WHY_US, IMAGES, GYM } from "../data/siteData";
import { ArrowRight } from "lucide-react";

export default function About() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
        <SectionHeading
          eyebrow="About Xtreme"
          title="Built for people who actually lift."
          body="Xtreme Fitness Gym runs on one idea: real strength coaching shouldn't come with a premium price tag. No academy, no distractions — just a focused, air-conditioned training floor coached by international powerlifters."
        />
      </section>

      <section className="border-y border-line">
        <div className="mx-auto grid max-w-7xl gap-0 md:grid-cols-2">
          <Reveal className="relative min-h-[320px] overflow-hidden md:min-h-[480px]">
            <img src={IMAGES.chalkHands.src} alt={IMAGES.chalkHands.alt} className="h-full w-full object-cover" />
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col justify-center gap-5 bg-panel p-8 sm:p-14">
            <span className="text-stencil text-xs font-bold text-plate-yellow">Our Floor</span>
            <h2 className="text-display text-3xl leading-tight sm:text-4xl">
              A gym floor, not a lifestyle brand.
            </h2>
            <p className="text-base leading-relaxed text-steel">
              There's no juice bar, no influencer wall, no upsell at the front desk. What you get is squat
              racks, a deadlift platform, honest coaching cues, and air conditioning that actually works —
              open {GYM.hours}, {GYM.days}.
            </p>
            <p className="text-base leading-relaxed text-steel">
              Coaching on the floor comes from trainers with backgrounds in international powerlifting
              competition — so the cues you get on your squat, bench and deadlift are built on competition
              standards, not guesswork.
            </p>
            <div>
              <Button to="/trainers" variant="ghost">
                Meet The Trainers <ArrowRight size={16} />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <SectionHeading
          eyebrow="Why Members Stay"
          title="Four things we don't compromise on."
          align="center"
          className="mx-auto"
        />
        <div className="mt-14 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {WHY_US.map((item, i) => (
            <WhyUsCard key={item.title} index={i} {...item} />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-line px-5 py-24 sm:px-8">
        <div className="absolute inset-0">
          <img src={IMAGES.womanLifting.src} alt="" className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-ink/85" />
        </div>
        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <h2 className="text-display text-4xl sm:text-5xl">See it for yourself.</h2>
          <p className="text-lg text-chalk-dim">
            Come by during open hours — {GYM.hours}, {GYM.days.toLowerCase()} — and walk the floor before you commit to anything.
          </p>
          <Button to="/contact" variant="primary">
            Find Us <ArrowRight size={16} />
          </Button>
        </div>
      </section>
    </div>
  );
}
