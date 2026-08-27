import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { REVIEWS } from "../data/siteData";

const AUTOPLAY_MS = 5000;

function Stars({ count }) {
  return (
    <div className="flex gap-1" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          fill={i < count ? "var(--color-plate-yellow)" : "none"}
          stroke="var(--color-plate-yellow)"
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export default function ReviewsCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const count = REVIEWS.length;

  const go = useCallback(
    (delta) => {
      setDirection(delta);
      setIndex((prev) => (prev + delta + count) % count);
    },
    [count]
  );

  const goTo = (i) => {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
  };

  useEffect(() => {
    if (paused || count <= 1) return;
    timerRef.current = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [paused, go, count]);

  const review = REVIEWS[index];

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div
      className="relative mx-auto max-w-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden border border-line bg-panel px-6 py-10 sm:px-12 sm:py-14">
        <Quote className="absolute left-6 top-6 text-plate-red/25 sm:left-10 sm:top-8" size={40} />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={review.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(1);
              else if (info.offset.x > 60) go(-1);
            }}
            className="relative flex cursor-grab flex-col items-center gap-5 text-center active:cursor-grabbing"
          >
            <Stars count={review.rating} />
            <p className="text-lg leading-relaxed text-chalk sm:text-xl">{review.text}</p>
            <span className="text-stencil text-xs font-bold text-steel">Verified Google Review</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous review"
            className="absolute left-0 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-ink p-2.5 text-chalk transition-colors hover:border-plate-red hover:text-plate-red sm:flex"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next review"
            className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-line-strong bg-ink p-2.5 text-chalk transition-colors hover:border-plate-red hover:text-plate-red sm:flex"
          >
            <ChevronRight size={20} />
          </button>

          <div className="mt-6 flex items-center justify-center gap-2">
            {REVIEWS.map((r, i) => (
              <button
                key={r.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to review ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-plate-red" : "w-1.5 bg-line-strong"
                }`}
              />
            ))}
          </div>

          <div className="mt-4 flex justify-center gap-4 sm:hidden">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous review"
              className="flex items-center justify-center rounded-full border border-line-strong bg-ink p-2.5 text-chalk"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next review"
              className="flex items-center justify-center rounded-full border border-line-strong bg-ink p-2.5 text-chalk"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
