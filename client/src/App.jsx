import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import CookieConsent from "./components/CookieConsent";
import ExitIntentModal from "./components/ExitIntentModal";
import Home from "./pages/Home";
import About from "./pages/About";
import Trainers from "./pages/Trainers";
import Programs from "./pages/Programs";
import Pricing from "./pages/Pricing";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import { trackVisit } from "./utils/tracking";

function PageWrapper({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.main>
  );
}

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  // One page-view beacon per route change (consent-gated inside trackVisit).
  useEffect(() => {
    if (!isAdmin) trackVisit(location.pathname);
  }, [location.pathname, isAdmin]);

  if (isAdmin) {
    // The owner's dashboard is deliberately outside the public chrome —
    // no navbar/footer/marketing widgets, and it isn't linked from NAV_LINKS.
    return (
      <Routes>
        <Route path="/admin" element={<Admin />} />
      </Routes>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="grain-overlay flex min-h-screen flex-col bg-ink">
        <ScrollToTop />
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
            <Route path="/trainers" element={<PageWrapper><Trainers /></PageWrapper>} />
            <Route path="/programs" element={<PageWrapper><Programs /></PageWrapper>} />
            <Route path="/pricing" element={<PageWrapper><Pricing /></PageWrapper>} />
            <Route path="/gallery" element={<PageWrapper><Gallery /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
        <Footer />
        <ExitIntentModal path={location.pathname} />
        <CookieConsent />
      </div>
    </MotionConfig>
  );
}
