import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import ForgeIgnition from "../components/ForgeIgnition";
import { WHY_US, PROGRAMS, PRICING_PLANS, GYM, IMAGES } from "../data/siteData";

const MARQUEE_ITEMS = [
  "10+ YEARS EXPERTISE",
  "STRICTLY NO STEROIDS",
  "1,000+ CLIENTS TRAINED",
  "PERSONAL GUIDANCE",
  "CLIMATE-CONTROLLED FLOOR",
  "SAFE & INCLUSIVE SPACE",
];

export default function Home() {
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem("hasSeenIntro");
  });

  const handleIntroComplete = () => {
    sessionStorage.setItem("hasSeenIntro", "true");
    setShowIntro(false);
  };

  useEffect(() => {
    if (showIntro) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [showIntro]);

  const googleReviewsUrl = `https://search.google.com/local/reviews?placeid=${GYM.address.placeId}`;
  
  const baseDelay = showIntro ? 2.8 : 0;

  return (
    <div>
      <AnimatePresence>
        {showIntro && <ForgeIgnition onComplete={handleIntroComplete} />}
      </AnimatePresence>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 z-0">
          <img src={IMAGES.heroGym.src} alt="" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/90 to-ink/60" />
        </div>
        
        <ChalkDust />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8 px-5 pb-24 pt-16 sm:px-8 sm:pb-32 sm:pt-20">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: baseDelay }}
            className="w-full max-w-5xl"
          >
            {/* LOGO AND BRANDING */}
            <div className="relative mt-4 flex flex-col items-center justify-center py-8">
              
              {/* The Logo Image - Rendered exactly as it is in your file */}
              <img
                src="/Xtreme logo.png"
                alt="Lifter Logo"
                className="relative z-10 h-32 w-auto drop-shadow-2xl sm:h-48"
              />

              {/* Billboard Font styling matching your image exactly */}
              <h1
                className="relative z-10 mt-6 text-center font-['Anton'] text-[2.75rem] uppercase leading-none tracking-wide text-[#fde047] sm:mt-8 sm:text-7xl md:text-[5.5rem] lg:text-8xl"
                style={{
                  WebkitTextStroke: "2.5px #111",
                  textShadow: "4px 4px 0px #111, 0 10px 25px rgba(0,0,0,0.7)",
                }}
              >
                Xtreme Fitness Gym
              </h1>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: baseDelay + 0.2 }}
            className="mt-4 flex flex-col gap-6"
          >
            <h2 className="text-display max-w-3xl text-4xl leading-tight text-chalk drop-shadow-md sm:text-5xl">
              {GYM.tagline}
            </h2>

            <span className="text-stencil w-fit border border-line-strong bg-ink/50 px-3.5 py-2 text-sm font-bold text-plate-yellow shadow-[0_0_20px_rgba(242,183,5,0.15)] backdrop-blur-md">
              5AM – 10PM &middot; MON–SAT &middot; AIR CONDITIONED
            </span>
            
            <p className="max-w-xl text-lg leading-relaxed text-chalk-dim sm:text-xl">
              {GYM.subTagline} Plans start at{" "}
              <span className="font-semibold text-chalk">₹1,200/month</span>.
            </p>

            <div className="mt-2 flex flex-wrap gap-4">
              <Button to="/pricing" variant="primary">
                See Pricing <ArrowRight size={16} />
              </Button>
              <Button to="/contact" variant="ghost">
                Visit The Floor
              </Button>
            </div>
          </motion.div>
        </div>

        {/* PREMIUM INTERACTIVE FIRE MARQUEE */}
        <div className="group relative flex cursor-default overflow-hidden border-t border-line bg-ink py-6">
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
        </div>
      </section>

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
          <img src={IMAGES.gymFloor.src} alt="" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-ink/85" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <h2 className="text-display text-4xl drop-shadow-md sm:text-6xl">Your first set starts today.</h2>
          <p className="max-w-lg text-lg text-chalk-dim">
            Walk in between {GYM.hours}, {GYM.days.toLowerCase()}. No pressure, no pushy sales pitch — just the floor.
          </p>
          <Button to="/contact" variant="primary">
            Get Directions &amp; Contact <ArrowRight size={16} />
          </Button>
        </div>
      </section>
    </div>
  );
}