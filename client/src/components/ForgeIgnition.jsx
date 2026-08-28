import { Link } from "react-router-dom";
import { MapPin, Clock, Phone, Mail, Star, ArrowRight } from "lucide-react";
import Button from "./Button";
import { GYM, NAV_LINKS } from "../data/siteData";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const googleReviewsUrl = `https://search.google.com/local/reviews?placeid=${GYM.address.placeId}`;

  return (
    <footer className="knurl-texture relative overflow-hidden border-t border-line bg-panel">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[70%] -translate-x-1/2 rounded-[100%] bg-plate-red/10 blur-[100px]"
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.5fr_1fr_1.5fr]">
        <div className="pr-4 lg:pr-12">
          <Link
            to="/"
            onClick={scrollToTop}
            aria-label="Go to home and scroll to top"
          >
            {/* Billboard Red Branding Container - Larger scale for the footer */}
            <span className="inline-flex flex-col items-center justify-center rounded-lg bg-gradient-to-b from-[#ef4444] via-[#dc2626] to-[#991b1b] px-6 py-3.5 shadow-[0_4px_25px_rgba(220,38,38,0.4)] ring-1 ring-white/10 transition-transform duration-300 hover:scale-[1.03]">
              <img
                src="/Xtreme logo.png"
                alt="Xtreme Fitness Gym Logo"
                className="h-12 w-auto object-contain drop-shadow-[0_3px_3px_rgba(0,0,0,0.8)]"
              />
              <span
                className="mt-2 font-['Anton'] text-sm leading-none uppercase tracking-[0.05em] text-[#fde047] sm:text-base"
                style={{
                  WebkitTextStroke: "1px #000",
                  textShadow: "2px 2px 0px #000",
                }}
              >
                Xtreme Fitness Gym
              </span>
            </span>
          </Link>
          
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-chalk-dim">
            Xtreme Fitness Gym is a serious strength and conditioning facility in New Delhi. We
            provide a no-nonsense environment equipped for powerlifting, bodybuilding, and real
            progress.
            <br />
            <br />
            {GYM.subTagline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={googleReviewsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 rounded-sm border border-line-strong bg-ink/50 px-5 py-3 text-sm font-bold text-chalk transition-all duration-300 hover:border-plate-yellow hover:text-plate-yellow hover:shadow-[0_0_20px_rgba(242,183,5,0.15)]"
            >
              <Star size={16} className="fill-plate-yellow text-plate-yellow" />
              Read our Google Reviews
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-stencil mb-6 text-sm font-bold tracking-[0.15em] text-plate-yellow">Explore</h3>
          <ul className="flex flex-col gap-3.5">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="inline-block text-sm text-steel transition-all duration-300 hover:translate-x-1 hover:text-plate-red"
                  onClick={scrollToTop}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-stencil mb-6 text-sm font-bold tracking-[0.15em] text-plate-yellow">Visit</h3>
          <ul className="flex flex-col gap-5 text-sm text-steel">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="shrink-0 text-plate-red" />
              <span className="leading-relaxed">
                {GYM.address.line2}
                <br />
                <a
                  href={GYM.address.mapsShareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block font-semibold underline decoration-line-strong underline-offset-4 transition-colors hover:text-chalk hover:decoration-plate-red"
                >
                  Get directions
                </a>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Clock size={18} className="shrink-0 text-plate-red" />
              <span className="leading-relaxed">
                {GYM.hours}
                <br />
                {GYM.days} &middot; {GYM.closedNote}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="shrink-0 text-plate-red" />
              <a href={`tel:${GYM.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-chalk">
                {GYM.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="shrink-0 text-plate-red" />
              <a href={`mailto:${GYM.email}`} className="transition-colors hover:text-chalk">
                {GYM.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-line px-5 py-6 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-stencil text-center text-xs tracking-[0.2em] text-steel-dim sm:text-left">
            © {new Date().getFullYear()} {GYM.name.toUpperCase()} — ALL RIGHTS RESERVED
          </p>
          <Button to="/pricing" variant="ghost" className="text-sm">
            Join Now <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </footer>
  );
}