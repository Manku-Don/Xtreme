import { Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import Button from "../components/Button";
import { NAV_LINKS } from "../data/siteData";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-5 py-24 text-center sm:px-8">
      <Reveal className="flex flex-col items-center">
        <Dumbbell size={40} strokeWidth={1.4} className="mb-6 text-plate-red" />
        <span className="text-stencil text-xs font-bold tracking-[0.14em] text-plate-yellow">
          ERROR 404
        </span>
        <h1 className="text-display mt-3 text-5xl leading-[0.95] text-chalk sm:text-6xl">
          That set doesn't exist.
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-steel">
          The page you're looking for isn't here — it may have moved, or the link was off. Let's
          get you back on the floor.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button to="/" variant="primary">
            Back To Home
          </Button>
          <Button to="/contact" variant="ghost">
            Contact Us
          </Button>
        </div>
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-stencil text-xs font-bold tracking-[0.1em] text-chalk-dim transition-colors hover:text-plate-red"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </Reveal>
    </section>
  );
}
