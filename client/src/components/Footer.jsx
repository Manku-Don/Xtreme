import { Link } from "react-router-dom";
import { MapPin, Clock, Phone, Mail, Star } from "lucide-react";
import { GYM, NAV_LINKS } from "../data/siteData";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Automatically generates a direct link to your Google Reviews using the Place ID
  const googleReviewsUrl = `https://search.google.com/local/reviews?placeid=${GYM.address.placeId}`;

  return (
    <footer className="border-t border-line bg-panel">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.5fr_1fr_1.5fr]">
        
        {/* Expanded Gym Info Section */}
        <div className="pr-4 lg:pr-12">
          <Link to="/" onClick={scrollToTop} className="inline-block" aria-label="Go to home and scroll to top">
            <img
              src="/Xtreme logo.png"
              alt="Xtreme Fitness Gym Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>
          <p className="mt-6 text-sm leading-relaxed text-steel">
            Xtreme Fitness Gym is a serious strength and conditioning facility in New Delhi. We provide a no-nonsense environment equipped for powerlifting, bodybuilding, and real progress.
            <br /><br />
            {GYM.subTagline}
          </p>
          
          {/* Dedicated Google Reviews Button in Footer */}
          <a 
            href={googleReviewsUrl} 
            target="_blank" 
            rel="noreferrer" 
            className="mt-6 inline-flex items-center gap-2 rounded-sm border border-line-strong bg-ink/50 px-4 py-2.5 text-xs font-bold text-chalk transition-all hover:border-plate-yellow hover:text-plate-yellow"
          >
            <Star size={14} className="fill-plate-yellow text-plate-yellow" />
            Read our Google Reviews
          </a>
        </div>

        <div>
          <h3 className="text-stencil mb-4 text-xs font-bold text-plate-yellow">Explore</h3>
          <ul className="flex flex-col gap-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-steel transition-colors hover:text-chalk" onClick={scrollToTop}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-stencil mb-4 text-xs font-bold text-plate-yellow">Visit</h3>
          <ul className="flex flex-col gap-4 text-sm text-steel">
            <li className="flex gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-plate-red" />
              <span className="leading-relaxed">
                {GYM.address.line2}
                <br />
                <a href={GYM.address.mapsShareUrl} target="_blank" rel="noreferrer" className="underline decoration-line-strong underline-offset-4 hover:text-chalk">
                  Get directions
                </a>
              </span>
            </li>
            <li className="flex gap-3">
              <Clock size={16} className="mt-0.5 shrink-0 text-plate-red" />
              <span>
                {GYM.hours}
                <br />
                {GYM.days} &middot; {GYM.closedNote}
              </span>
            </li>
            <li className="flex gap-3">
              <Phone size={16} className="mt-0.5 shrink-0 text-plate-red" />
              <a href={`tel:${GYM.phone.replace(/\s/g, "")}`} className="hover:text-chalk">
                {GYM.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail size={16} className="mt-0.5 shrink-0 text-plate-red" />
              <a href={`mailto:${GYM.email}`} className="hover:text-chalk">
                {GYM.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line px-5 py-6 sm:px-8">
        <p className="text-stencil text-center text-[0.65rem] tracking-[0.2em] text-steel-dim">
          © {new Date().getFullYear()} {GYM.name.toUpperCase()} — ALL RIGHTS RESERVED
        </p>
      </div>
    </footer>
  );
}