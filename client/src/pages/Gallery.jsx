import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { GALLERY_IMAGES } from "../data/siteData";

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(null);
  const isOpen = activeIndex !== null;

  const close = () => setActiveIndex(null);
  const next = (e) => {
    e?.stopPropagation();
    setActiveIndex((i) => (i + 1) % GALLERY_IMAGES.length);
  };
  const prev = (e) => {
    e?.stopPropagation();
    setActiveIndex((i) => (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  };

  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
        <SectionHeading
          eyebrow="Gallery"
          title="A look at the floor."
          body="A glimpse of the training floor — tap any photo for a closer look."
        />
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {GALLERY_IMAGES.map((img, i) => (
            <Reveal
              key={img.src + i}
              delay={(i % 4) * 0.06}
              className={`group relative cursor-pointer overflow-hidden bg-panel ${
                i === 0 ? "col-span-2 row-span-2" : "aspect-square"
              }`}
            >
              <button
                type="button"
                onClick={() => setActiveIndex(i)}
                className="block h-full w-full"
                aria-label="Open image"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/20" />
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4 sm:p-10"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-chalk hover:border-plate-red hover:text-plate-red"
            >
              <X size={20} />
            </button>

            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong text-chalk hover:border-plate-red hover:text-plate-red sm:left-8"
            >
              <ChevronLeft size={22} />
            </button>

            <motion.img
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              src={GALLERY_IMAGES[activeIndex].src}
              alt={GALLERY_IMAGES[activeIndex].alt}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[80vh] max-w-full object-contain"
            />

            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong text-chalk hover:border-plate-red hover:text-plate-red sm:right-8"
            >
              <ChevronRight size={22} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
