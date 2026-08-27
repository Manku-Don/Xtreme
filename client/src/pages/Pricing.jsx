import SectionHeading from "../components/SectionHeading";
import PricingCard from "../components/PricingCard";
import Reveal from "../components/Reveal";
import { PRICING_PLANS, PLAN_INCLUSIONS } from "../data/siteData";
import { Check } from "lucide-react";

export default function Pricing() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
        <SectionHeading
          align="center"
          eyebrow="Membership"
          title="Pricing that stays out of your way."
          body="One tier of training, three ways to pay for it. Longer commitments simply cost less per month — nothing is locked behind a higher plan."
          className="mx-auto"
        />
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {PRICING_PLANS.map((plan, i) => (
            <PricingCard key={plan.id} plan={plan} index={i} />
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-panel/40 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <span className="text-stencil text-xs font-bold text-plate-yellow">Every Plan Includes</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-display mt-2 text-3xl sm:text-4xl">No fine print, just the floor.</h2>
          </Reveal>
          <ul className="mt-8 flex flex-col gap-4">
            {PLAN_INCLUSIONS.map((point, i) => (
              <Reveal key={point} delay={0.12 + i * 0.06} className="flex items-start gap-3 border-b border-line pb-4 last:border-b-0">
                <Check size={18} className="mt-0.5 shrink-0 text-plate-yellow" />
                <span className="text-base text-chalk-dim">{point}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
