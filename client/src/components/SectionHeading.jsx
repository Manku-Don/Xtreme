import Reveal from "./Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  light = false,
  className = "",
}) {
  const alignClass = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";
  const bodyColor = light ? "text-bone-ink/70" : "text-steel";
  const eyebrowColor = light ? "text-plate-red" : "text-plate-yellow";

  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignClass} ${className}`}>
      {eyebrow && (
        <Reveal>
          <span className={`text-stencil text-xs font-bold ${eyebrowColor}`}>{eyebrow}</span>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2 className={`text-display text-4xl leading-[0.95] sm:text-5xl md:text-6xl ${light ? "text-bone-ink" : "text-chalk"}`}>
          {title}
        </h2>
      </Reveal>
      {body && (
        <Reveal delay={0.16}>
          <p className={`text-base leading-relaxed sm:text-lg ${bodyColor}`}>{body}</p>
        </Reveal>
      )}
    </div>
  );
}
