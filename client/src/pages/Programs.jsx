import SectionHeading from "../components/SectionHeading";
import ProgramCard from "../components/ProgramCard";
import Reveal from "../components/Reveal";
import Button from "../components/Button";
import { PROGRAMS } from "../data/siteData";
import { ArrowRight } from "lucide-react";

export default function Programs() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
        <SectionHeading
          eyebrow="Programs"
          title="Every path leads to the same floor."
          body="Whether you want a coach planning every set or the run of the equipment on your own schedule, it all happens on the same air-conditioned training floor."
        />
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {PROGRAMS.map((program, i) => (
            <ProgramCard key={program.id} index={i} {...program} />
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-panel/40 px-5 py-20 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <Reveal>
            <span className="text-stencil text-xs font-bold text-plate-yellow">Not Sure Which One?</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-display text-3xl sm:text-4xl">Come in, and we'll figure it out together.</h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="text-base leading-relaxed text-steel">
              Drop by during open hours and talk to a coach directly — most members land on the right
              program after one conversation on the floor, not a form.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <Button to="/contact" variant="primary">
              Talk To A Coach <ArrowRight size={16} />
            </Button>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
