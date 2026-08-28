import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { GYM, API_BASE_URL } from "../data/siteData";

const initialForm = { name: "", phone: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handlePhoneChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    setForm((f) => ({ ...f, phone: digitsOnly }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(`${API_BASE_URL}/api/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
    }
  };

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    GYM.address.mapsEmbedQuery
  )}&output=embed`;

  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
        <SectionHeading
          eyebrow="Get In Touch"
          title="Come see the floor."
          body="Walk in during open hours, call ahead, or send a quick enquiry — a coach will get back to you directly."
        />
      </section>

      <section className="mx-auto max-w-7xl gap-10 px-5 pb-24 sm:px-8 lg:grid lg:grid-cols-[1fr_1.1fr]">
        <Reveal className="flex flex-col gap-6">
          <div className="overflow-hidden border border-line">
            <iframe
              title="Xtreme Fitness Gym location"
              src={mapSrc}
              className="h-72 w-full grayscale invert-0"
              style={{ filter: "grayscale(0.4) contrast(1.1) brightness(0.9)" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="flex flex-col gap-5 border border-line bg-panel p-7">
            <div className="flex gap-3.5">
              <MapPin size={20} className="mt-0.5 shrink-0 text-plate-red" />
              <div>
                <p className="text-stencil text-xs font-bold text-chalk">Address</p>
                <p className="mt-1 text-sm leading-relaxed text-steel">{GYM.address.line2}</p>
                <a
                  href={GYM.address.mapsShareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-sm text-plate-yellow underline decoration-line-strong underline-offset-2"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
            <div className="flex gap-3.5 border-t border-line pt-5">
              <Clock size={20} className="mt-0.5 shrink-0 text-plate-red" />
              <div>
                <p className="text-stencil text-xs font-bold text-chalk">Hours</p>
                <p className="mt-1 text-sm text-steel">
                  {GYM.hours} &middot; {GYM.days} &middot; {GYM.closedNote}
                </p>
              </div>
            </div>
            <div className="flex gap-3.5 border-t border-line pt-5">
              <Phone size={20} className="mt-0.5 shrink-0 text-plate-red" />
              <a href={`tel:${GYM.phone.replace(/\s/g, "")}`} className="mt-1 text-sm text-steel hover:text-chalk">
                {GYM.phone}
              </a>
            </div>
            <div className="flex gap-3.5 border-t border-line pt-5">
              <Mail size={20} className="mt-0.5 shrink-0 text-plate-red" />
              <a href={`mailto:${GYM.email}`} className="mt-1 text-sm text-steel hover:text-chalk">
                {GYM.email}
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 border border-line bg-panel p-7 sm:p-10 lg:mt-0">
          <h3 className="text-display text-2xl">Send An Enquiry</h3>
          <p className="mt-2 text-sm text-steel">
            Tell us a little about your goals — a coach will call or message you back.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5">
            <div>
              <label htmlFor="name" className="text-stencil text-xs font-bold text-chalk-dim">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="mt-2 w-full border border-line-strong bg-panel-2 px-4 py-3 text-chalk placeholder:text-steel-dim outline-none transition-colors duration-200 focus:border-plate-red focus:ring-1 focus:ring-plate-red/30"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label htmlFor="phone" className="text-stencil text-xs font-bold text-chalk-dim">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                required
                pattern="[6-9][0-9]{9}"
                title="Enter a valid 10-digit mobile number"
                maxLength={10}
                value={form.phone}
                onChange={handlePhoneChange}
                className="mt-2 w-full border border-line-strong bg-panel-2 px-4 py-3 text-chalk placeholder:text-steel-dim outline-none transition-colors duration-200 focus:border-plate-red focus:ring-1 focus:ring-plate-red/30"
                placeholder="10-digit mobile number"
              />
            </div>
            <div>
              <label htmlFor="message" className="text-stencil text-xs font-bold text-chalk-dim">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                className="mt-2 w-full resize-none border border-line-strong bg-panel-2 px-4 py-3 text-chalk placeholder:text-steel-dim outline-none transition-colors duration-200 focus:border-plate-red focus:ring-1 focus:ring-plate-red/30"
                placeholder="Which plan are you interested in?"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={status === "loading"}
              className="text-stencil flex items-center justify-center gap-2 bg-plate-red px-6 py-3.5 text-sm font-bold tracking-[0.12em] text-chalk transition-colors hover:bg-plate-red-dim disabled:opacity-60"
            >
              {status === "loading" ? "Sending..." : (
                <>
                  Send Enquiry <Send size={16} />
                </>
              )}
            </motion.button>

            {status === "success" && (
              <p className="flex items-center gap-2 text-sm text-plate-yellow">
                <CheckCircle2 size={16} /> Thanks — we've got your enquiry and will reach out soon.
              </p>
            )}
            {status === "error" && (
              <p className="flex items-center gap-2 text-sm text-plate-red">
                <AlertCircle size={16} /> Couldn't send that — call {GYM.phone} instead, or try again.
              </p>
            )}
          </form>
        </Reveal>
      </section>
    </div>
  );
}
