import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Flame, ArrowRight } from "lucide-react";
import Button from "./Button";
import { NAV_LINKS, FREE_DEMO } from "../data/siteData";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="relative overflow-hidden border-b border-line bg-gradient-to-r from-plate-red-dim via-plate-red to-plate-red-dim">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-5 py-2 text-center sm:px-8">
          <Flame size={14} className="shrink-0 text-plate-yellow" strokeWidth={2.5} />
          <span className="text-stencil text-[0.65rem] font-bold tracking-[0.1em] text-chalk sm:text-xs">
            {FREE_DEMO.badge}
          </span>
          <Link
            to="/contact"
            className="text-stencil hidden shrink-0 items-center gap-1 text-[0.65rem] font-bold tracking-[0.1em] text-plate-yellow underline decoration-plate-yellow/50 underline-offset-2 transition-colors hover:text-chalk sm:inline-flex sm:text-xs"
          >
            Claim yours <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-colors duration-300 ${
          scrolled ? "bg-ink/90 backdrop-blur-md border-b border-line" : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2 sm:px-8">
          <NavLink to="/" onClick={scrollToTop} aria-label="Xtreme Fitness Gym home">
            <span className="inline-flex flex-col items-center justify-center rounded bg-gradient-to-b from-plate-red to-plate-red-dim px-3 py-1.5 shadow-[0_0_15px_rgba(214,40,40,0.4),inset_0_1px_0_rgba(255,255,255,0.25)] ring-1 ring-white/10 transition-transform duration-300 hover:scale-[1.03]">
              <img
                src="/Xtreme logo.png"
                alt="Xtreme Fitness Gym Logo"
                className="h-7 w-auto object-contain drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
              />
              <span
                className="mt-1 font-['Anton'] text-[0.6rem] leading-none uppercase tracking-[0.05em] text-plate-yellow"
                style={{
                  WebkitTextStroke: "0.5px var(--color-ink)",
                  textShadow: "1px 1px 0px var(--color-ink)",
                }}
              >
                Xtreme Fitness Gym
              </span>
            </span>
          </NavLink>

          <nav className="hidden items-center gap-2 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className="group relative px-3.5 py-2"
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`text-stencil text-sm font-bold tracking-[0.14em] transition-colors ${
                        isActive ? "text-plate-red" : "text-chalk-dim group-hover:text-chalk"
                      }`}
                    >
                      {link.label}
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-3.5 -bottom-0.5 h-[2px] bg-plate-red"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:block">
            {/* MARKETING TWEAK: Direct value-proposition button instead of generic "Join" */}
            <Button to="/pricing" variant="primary" className="text-sm">
              View Plans
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-line-strong text-chalk transition-colors hover:border-plate-red hover:text-plate-red lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="plate-texture absolute inset-x-0 top-full z-40 h-screen bg-ink lg:hidden"
            >
              <motion.nav
                className="flex h-full flex-col gap-1 px-6 py-8"
                initial="closed"
                animate="open"
                variants={{
                  open: { transition: { staggerChildren: 0.06 } },
                  closed: {},
                }}
              >
                {NAV_LINKS.map((link) => (
                  <motion.div
                    key={link.to}
                    variants={{
                      closed: { opacity: 0, x: -16 },
                      open: { opacity: 1, x: 0 },
                    }}
                  >
                    <NavLink
                      to={link.to}
                      end={link.to === "/"}
                      className="text-display flex items-center justify-between border-b border-line py-5 text-4xl text-chalk transition-colors duration-300 hover:text-plate-red"
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
                <motion.div
                  variants={{ closed: { opacity: 0, x: -16 }, open: { opacity: 1, x: 0 } }}
                  className="mt-8"
                >
                  {/* MARKETING TWEAK: High-impact mobile CTA capturing the free demo intent directly from the menu. */}
                  <Button to="/contact" variant="primary" className="w-full text-lg py-4">
                    Claim Free Demo
                  </Button>
                </motion.div>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}