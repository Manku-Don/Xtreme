import Reveal from "./Reveal";
import Button from "./Button";
import PlateStack from "./PlateStack";

export default function PricingCard({ plan, index }) {
  const { name, price, perMonth, duration, tagline, savings, featured, plates } = plan;

  return (
    <Reveal
      delay={index * 0.1}
      className={`group relative flex flex-col border p-8 transition-all duration-500 hover:-translate-y-1.5 ${
        featured
          ? "border-plate-yellow bg-panel-2 shadow-[0_0_0_1px_rgba(242,183,5,0.3)] hover:shadow-[0_10px_40px_-10px_rgba(242,183,5,0.4)]"
          : "border-line bg-panel hover:bg-ink hover:border-plate-red/40 hover:shadow-[0_10px_40px_-10px_rgba(204,51,0,0.3)]"
      }`}
    >
      {featured && (
        <span className="text-stencil absolute -top-3.5 left-8 bg-plate-yellow px-3.5 py-1.5 text-xs font-bold text-ink shadow-md">
          Most Popular
        </span>
      )}

      <span className="text-stencil text-sm font-bold text-steel transition-colors duration-500 group-hover:text-chalk">
        {tagline}
      </span>
      
      <h3 className="text-display mt-2 text-3xl text-chalk">{name}</h3>

      <div className="my-6 flex h-32 items-center justify-center transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-110">
        <PlateStack plates={plates} className="h-full w-full drop-shadow-xl" />
      </div>

      <div className="flex flex-col gap-1">
        <span 
          className={`text-display text-5xl transition-colors duration-500 ${
            featured ? "text-chalk group-hover:text-plate-yellow" : "text-chalk group-hover:text-plate-red"
          }`}
        >
          ₹{price.toLocaleString("en-IN")}
        </span>
        {/* MARKETING TWEAK: Explicitly state "Zero Registration Fees" on hover. High trust signal. */}
        <span className="h-4 text-xs font-semibold tracking-wide text-transparent transition-colors duration-500 group-hover:text-chalk-dim uppercase">
          Zero Registration Fees
        </span>
      </div>
      
      <p className="mt-2 text-sm text-steel">
        for {duration} &middot; ₹{perMonth.toLocaleString("en-IN")}/month equivalent
      </p>
      
      {savings && (
        <p className="text-stencil mt-3 text-sm font-bold text-plate-yellow">
          {savings}
        </p>
      )}

      <div className="mt-8">
        {/* MARKETING TWEAK: Action-oriented CTA replacing generic "Start Training" */}
        <Button to="/contact" variant={featured ? "primary" : "ghost"} className="w-full">
          {featured ? "Claim This Plan" : "Select Plan"}
        </Button>
      </div>
    </Reveal>
  );
}