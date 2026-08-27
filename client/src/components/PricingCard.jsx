import Reveal from "./Reveal";
import Button from "./Button";
import PlateStack from "./PlateStack";

export default function PricingCard({ plan, index }) {
  const { name, price, perMonth, duration, tagline, savings, featured, plates } = plan;

  return (
    <Reveal
      delay={index * 0.1}
      className={`relative flex flex-col border p-8 ${
        featured
          ? "border-plate-yellow bg-panel-2 shadow-[0_0_0_1px_rgba(242,183,5,0.3)]"
          : "border-line bg-panel"
      }`}
    >
      {featured && (
        <span className="text-stencil absolute -top-3 left-8 bg-plate-yellow px-3 py-1 text-[0.65rem] font-bold text-ink">
          Most Popular
        </span>
      )}

      <span className="text-stencil text-xs font-bold text-steel">{tagline}</span>
      <h3 className="text-display mt-2 text-3xl text-chalk">{name}</h3>

      <div className="my-6 flex h-32 items-center justify-center">
        <PlateStack plates={plates} className="h-full w-full" />
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-display text-5xl text-chalk">₹{price.toLocaleString("en-IN")}</span>
      </div>
      <p className="mt-1 text-sm text-steel">
        for {duration} &middot; ₹{perMonth.toLocaleString("en-IN")}/month equivalent
      </p>
      {savings && <p className="text-stencil mt-2 text-xs font-bold text-plate-yellow">{savings}</p>}

      <div className="mt-8">
        <Button to="/contact" variant={featured ? "primary" : "ghost"} className="w-full">
          Start Training
        </Button>
      </div>
    </Reveal>
  );
}
