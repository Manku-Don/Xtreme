import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star, Flame } from "lucide-react";
import Button from "../components/Button";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import ChalkDust from "../components/ChalkDust";
import WhyUsCard from "../components/WhyUsCard";
import ProgramCard from "../components/ProgramCard";
import PricingCard from "../components/PricingCard";
import ReviewsCarousel from "../components/ReviewsCarousel";
import StatsStrip from "../components/StatsStrip";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import { WHY_US, PROGRAMS, PRICING_PLANS, GYM, IMAGES, FREE_DEMO } from "../data/siteData";

const MARQUEE_ITEMS = [
  "10+ YEARS EXPERTISE",
  "STRICTLY NO STEROIDS",
  "1,000+ CLIENTS TRAINED",
  "PERSONAL GUIDANCE",
  "CLIMATE-CONTROLLED FLOOR",
  "SAFE & INCLUSIVE SPACE",
];

export default function Home() {
  // We use useRef to create an immutable constant. 
  // This physically guarantees the logo animation runs exactly ONCE and never double-loads.
  const isFirstLoad = useRef(!sessionStorage.getItem("hasSeenIntro")).current;
  
  const [showIntro, setShowIntro] = useState(isFirstLoad);

  const [prefersReducedMotion] = useState(() =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  useEffect(() => {
    if (!showIntro || prefersReducedMotion) return;

    document.body.style.overflow = "hidden";

    // The entire fade-in sequence completes at 2.4s. 
    // We then remove the CSS lock and unlock scrolling.
    const unlockTimer = setTimeout(() => {
      setShowIntro(false);
      sessionStorage.setItem("hasSeenIntro", "true");
      document.body.style.overflow = "";
    }, 2400);

    return () => clearTimeout(unlockTimer);
  }, [showIntro, prefersReducedMotion]);

  const googleReviewsUrl = `https://search.google.com/local/reviews?placeid=${GYM.address.placeId}`;

  return (
    <div>
      {/* THE GHOST MODE LOCK: Injects CSS to hide external elements (like the Navbar) during the intro */}
      {showIntro && (
        <style>{`
          /* Forces the body to be pitch black on load */
          body {
            background-color: #050505 !important;
          }
          /* Targets your Navbar and Promo bar directly. Starts them invisible, then fades them in perfectly at 1.4s */
          header, .from-plate-red-dim {
            animation: xtremeBootFadeIn 1s ease-in-out 1.4s both !important;
          }
          @keyframes xtremeBootFadeIn {
            0% { opacity: 0; pointer-events: none; }
            100% { opacity: 1; pointer-events: auto; }
          }
        `}</style>
      )}

      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-line">
        
        {/* HERO BACKGROUND: Fades in seamlessly behind the logo */}
        <motion.div 
          className="absolute inset-0 z-0"
          initial={isFirstLoad ? { opacity: 0 } : false}
          animate={isFirstLoad ? { opacity: 1 } : false}
          transition={{ duration: 1, delay: isFirstLoad ? 1.4 : 0 }}
        >
          <img src={IMAGES.heroGym.src} alt={IMAGES.heroGym.alt} className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/90 to-ink/60" />
        </motion.div>
        
        <motion.div
          initial={isFirstLoad ? { opacity: 0 } : false}
          animate={isFirstLoad ? { opacity: 1 } : false}
          transition={{ duration: 1, delay: isFirstLoad ? 1.4 : 0 }}
        >
          <ChalkDust />
        </motion.div>

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-center gap-8 px-5 pb-24 pt-16 text-center sm:px-8 sm:pb-32 sm:pt-20">
          
          <div className="flex w-full max-w-5xl flex-col items-center justify-center">
            
            {/* THE ANCHOR LOGO */}
            {/* Because the Navbar is hidden by our CSS injection, this is the ONLY thing visible on the screen */}
            <div className="relative flex flex-col items-center justify-center py-6 sm:py-8 z-10">
              <motion.div
                // THE STADIUM POWER-ON ANIMATION
                initial={isFirstLoad ? { opacity: 0, filter: "brightness(0) blur(10px)", scale: 0.95 } : false}
                animate={isFirstLoad ? { 
                  opacity: [0, 1, 0.1, 1], 
                  filter: [
                    "brightness(0) blur(10px)", 
                    "brightness(1.5) blur(0px)", // Searing bright flash
                    "brightness(0.3) blur(2px)", // Power dip
                    "brightness(1) blur(0px)"    // Settle to sharp focus
                  ],
                  scale: [0.95, 1.02, 0.98, 1] 
                } : false}
                transition={{ duration: 1.2, times: [0, 0.3, 0.5, 1], ease: "easeOut" }}
                className="flex flex-col items-center justify-center"
              >
                <img
                  src="/Xtreme logo.png"
                  alt="Lifter Logo"
                  className="relative z-10 h-24 w-auto drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] sm:h-32 md:h-40 lg:h-48"
                />
                <h1
                  className="relative z-10 mt-4 text-center font-['Anton'] text-[2.5rem] uppercase leading-[1.1] tracking-wide text-plate-yellow sm:mt-6 sm:text-6xl sm:leading-none md:text-7xl lg:text-[5.5rem] xl:text-8xl"
                  style={{
                    WebkitTextStroke: "2px var(--color-ink)",
                    textShadow: "3px 3px 0px var(--color-ink), 0 10px 25px rgba(0,0,0,0.9)",
                  }}
                >
                  Xtreme Fitness Gym
                </h1>
              </motion.div>
            </div>
          </div>

          {/* HERO TEXT REVEAL */}
          <motion.div
            initial={isFirstLoad ? { opacity: 0, y: 20 } : false}
            animate={isFirstLoad ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.8, delay: isFirstLoad ? 1.4 : 0 }}
            className="mt-2 flex w-full flex-col items-center gap-6"
          >
            <h2 className="text-display mx-auto max-w-4xl text-4xl leading-tight text-chalk drop-shadow-md sm:text-5xl lg:text-6xl">
              {GYM.tagline}
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-stencil w-fit border border-line-strong bg-ink/50 px-3.5 py-2 text-xs font-bold text-plate-yellow shadow-[0_0_20px_rgba(242,183,5,0.15)] backdrop-blur-md sm:text-sm">
                5AM – 10PM &middot; MON–SAT &middot; AIR CONDITIONED
              </span>
              <span className="text-stencil flex w-fit items-center gap-2 border border-plate-red/40 bg-plate-red/10 px-3.5 py-2 text-xs font-bold text-chalk shadow-[0_0_20px_rgba(214,40,40,0.15)] backdrop-blur-md sm:text-sm">
                <Flame size={15} className="text-plate-red" strokeWidth={2.5} />
                {FREE_DEMO.badge}
              </span>
            </div>

            <p className="mx-auto max-w-xl text-base leading-relaxed text-chalk-dim sm:text-lg lg:text-xl">
              {GYM.subTagline} Plans start at{" "}
              <span className="font-semibold text-chalk">₹750/month</span>.
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
              <Button to="/contact" variant="primary">
                Claim Your Free Demo <ArrowRight size={16} />
              </Button>
              <Button to="/pricing" variant="ghost">
                See Pricing
              </Button>
            </div>
          </motion.div>
        </div>

        {/* MARQUEE */}
        <motion.div
          initial={isFirstLoad ? { opacity: 0 } : false}
          animate={isFirstLoad ? { opacity: 1 } : false}
          transition={{ duration: 0.8, delay: isFirstLoad ? 1.4 : 0 }}
          className="group relative flex cursor-default overflow-hidden border-t border-line bg-ink py-6"
        >
          <motion.div
            animate={{ 
              opacity: [0.15, 0.4, 0.15],
              scale: [1, 1.5, 1],
              x: ["-20%", "20%", "-20%"]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[150px] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-plate-red/30 blur-[60px] transition-opacity duration-700 group-hover:opacity-70"
          />

          <motion.div
            className="relative z-10 flex w-max flex-nowrap items-center pr-12"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 25,
            }}
          >
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <div key={i} className="flex shrink-0 items-center">
                <span className="text-stencil px-12 text-base font-bold tracking-[0.2em] text-steel transition-colors duration-500 group-hover:text-chalk group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  {item}
                </span>
                <Flame 
                  size={20} 
                  strokeWidth={2.5} 
                  className="text-plate-red transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_rgba(204,51,0,0.6)]" 
                />
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* THE REST OF THE WEBSITE */}
      {/* We wrap everything below the fold in one invisible block and fade it in at 1.4s alongside the Navbar */}
      <motion.div
        initial={isFirstLoad ? { opacity: 0 } : false}
        animate={isFirstLoad ? { opacity: 1 } : false}
        transition={{ duration: 1, delay: isFirstLoad ? 1.4 : 0 }}
      >
        <StatsStrip />

        {/* WHY US */}
        <section className="border-t border-line bg-panel/40 px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Why Xtreme"
              title="Serious training. Honest pricing."
              body="A no-nonsense floor built around real coaching and real affordability — not gimmicks."
            />
            <div className="mt-14 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {WHY_US.map((item, i) => (
                <WhyUsCard key={item.title} index={i} {...item} />
              ))}
            </div>
          </div>
        </section>

        {/* PROGRAMS PREVIEW */}
        <section className="border-y border-line px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Train With Us"
              title="Pick your path on the floor."
              body="From one-on-one powerlifting coaching to open gym access — every program runs on the same air-conditioned floor."
            />
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {PROGRAMS.map((program, i) => (
                <ProgramCard key={program.id} index={i} {...program} />
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Button to="/programs" variant="ghost">
                View All Programs <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <SectionHeading
            align="center"
            eyebrow="Members Say"
            title="Real reviews from the floor."
            className="mx-auto"
          />
          
          <div className="mb-10 mt-6 flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Star size={18} fill="var(--color-plate-yellow)" stroke="var(--color-plate-yellow)" />
              <span className="text-chalk-dim">4.8 on Google </span>
            </div>
            <a 
              href={googleReviewsUrl} 
              target="_blank" 
              rel="noreferrer"
              className="text-stencil text-sm font-bold tracking-[0.2em] text-plate-red underline decoration-line-strong underline-offset-4 transition-all duration-300 hover:text-plate-yellow hover:drop-shadow-[0_0_8px_rgba(242,183,5,0.4)]"
            >
              READ ALL GOOGLE REVIEWS &rarr;
            </a>
          </div>
          
          <ReviewsCarousel />
        </section>

        {/* PRICING PREVIEW */}
        <section className="border-y border-line bg-panel/40 px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              align="center"
              eyebrow="Membership"
              title="Loaded with value, not fine print."
              body="Three plans. One price you can actually plan around."
              className="mx-auto"
            />
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {PRICING_PLANS.map((plan, i) => (
                <PricingCard key={plan.id} plan={plan} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden px-5 py-24 sm:px-8">
          <div className="absolute inset-0 z-0">
            <img src={IMAGES.gymFloor.src} alt={IMAGES.gymFloor.alt} className="h-full w-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-ink/85" />
          </div>
          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <span className="text-stencil flex items-center gap-2 text-sm font-bold tracking-[0.2em] text-plate-red">
              <Flame size={16} strokeWidth={2.5} /> {FREE_DEMO.short.toUpperCase()}
            </span>
            <h2 className="text-display text-4xl drop-shadow-md sm:text-6xl">Your first set starts today.</h2>
            <p className="max-w-lg text-lg text-chalk-dim">
              Walk in between {GYM.hours}, {GYM.days.toLowerCase()}, and train your first day free. No pressure,
              no pushy sales pitch — just the floor.
            </p>
            <Button to="/contact" variant="primary">
              Get Directions &amp; Contact <ArrowRight size={16} />
            </Button>
          </div>
        </section>

        <FloatingWhatsApp />
      </motion.div>
    </div>
  );
}