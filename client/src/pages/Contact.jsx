import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Mail, Send, CheckCircle2, AlertCircle, Flame, MessageCircle, Star } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import NearbyBanner from "../components/NearbyBanner";
import { GYM, API_BASE_URL, FREE_DEMO } from "../data/siteData";
import { submitWhatsappOptIn, TAG_OPTIONS } from "../utils/tracking";

const initialForm = { name: "", phone: "", message: "", wantsDemo: false, wantsWhatsappUpdates: false, tags: [] };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handlePhoneChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    setForm((f) => ({ ...f, phone: digitsOnly }));
  };

  const toggleTag = (tagId) => {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tagId) ? f.tags.filter((t) => t !== tagId) : [...f.tags, tagId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    const message = form.wantsDemo
      ? `[Interested in the ${FREE_DEMO.short}] ${form.message}`.trim()
      : form.message;
    try {
      const res = await fetch(`${API_BASE_URL}/api/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, phone: form.phone, message, tags: form.tags }),
      });
      if (!res.ok) throw new Error("Request failed");

      // Separate, explicit opt-in — booking a demo doesn't by itself sign
      // someone up for ongoing WhatsApp marketing messages.
      if (form.wantsWhatsappUpdates) {
        await submitWhatsappOptIn({
          name: form.name,
          phone: form.phone,
          source: "contact_form",
          wantsDemo: form.wantsDemo,
          message,
          tags: form.tags,
        });
      }

      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
    }
  };

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    GYM.address.mapsEmbedQuery
  )}&output=embed`;

  // Pre-filled WhatsApp message for frictionless conversion
  const preFilledMessage = encodeURIComponent("Hey! I'm reaching out from the website. 💪");
  const whatsappUrl = `${GYM.whatsapp}?text=${preFilledMessage}`;

  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
        {/* MARKETING TWEAK: Added immediate social proof right above the heading */}
        <div className="mb-6 flex items-center justify-center gap-2 lg:justify-start">
          <div className="flex gap-0.5 text-plate-yellow">
            <Star size={16} fill="currentColor" />
            <Star size={16} fill="currentColor" />
            <Star size={16} fill="currentColor" />
            <Star size={16} fill="currentColor" />
            <Star size={16} fill="currentColor" />
          </div>
          <span className="text-stencil text-xs font-bold tracking-widest text-chalk-dim">
            4.8/5 GOOGLE RATING
          </span>
        </div>

        <SectionHeading
          eyebrow="Get In Touch"
          title="Come see the floor."
          body={`Walk in during open hours, drop a WhatsApp message, or send a quick enquiry below — a coach will get back to you directly. First time in? Claim your ${FREE_DEMO.short.toLowerCase()}.`}
        />
      </section>

      <section className="mx-auto max-w-7xl gap-10 px-5 pb-24 sm:px-8 lg:grid lg:grid-cols-[1fr_1.1fr]">
        <Reveal className="flex flex-col gap-6">
          
          {/* MARKETING TWEAK: Interactive map reveal. Stays aesthetic by default, blooms to functional full-color on hover so they can actually navigate. */}
          <div className="group overflow-hidden border border-line bg-panel relative">
            <iframe
              title="Xtreme Fitness Gym location"
              src={mapSrc}
              className="h-72 w-full transition-all duration-700 ease-in-out group-hover:scale-105"
              style={{ filter: "grayscale(1) contrast(1.2) brightness(0.8)" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="pointer-events-none absolute inset-0 bg-transparent transition-all duration-700 group-hover:backdrop-blur-none group-hover:bg-transparent" />
            {/* The CSS override class to remove grayscale on hover */}
            <style>{`
              .group:hover iframe {
                filter: grayscale(0) contrast(1) brightness(1) !important;
              }
            `}</style>
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
                  className="mt-1 inline-block text-sm text-plate-yellow underline decoration-line-strong underline-offset-2 transition-colors hover:text-chalk"
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
            
            {/* MARKETING TWEAK: Explicitly separated Phone and WhatsApp to show we are highly accessible */}
            <div className="flex gap-3.5 border-t border-line pt-5">
              <Phone size={20} className="mt-0.5 shrink-0 text-plate-red" />
              <div>
                <p className="text-stencil text-xs font-bold text-chalk">Call Us</p>
                <a href={`tel:${GYM.phone.replace(/\s/g, "")}`} className="mt-1 block text-sm text-steel hover:text-chalk">
                  {GYM.phone}
                </a>
              </div>
            </div>
            
            <div className="flex gap-3.5 border-t border-line pt-5">
              <Mail size={20} className="mt-0.5 shrink-0 text-plate-red" />
              <div>
                <p className="text-stencil text-xs font-bold text-chalk">Email</p>
                <a href={`mailto:${GYM.email}`} className="mt-1 block text-sm text-steel hover:text-chalk">
                  {GYM.email}
                </a>
              </div>
            </div>
          </div>

          <div className="border border-line bg-panel p-5">
            <p className="text-stencil mb-3 text-xs font-bold text-chalk-dim">
              Coming from work or home?
            </p>
            <NearbyBanner />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 border border-line bg-panel p-7 sm:p-10 lg:mt-0">
          <h3 className="text-display text-2xl">Send An Enquiry</h3>
          <p className="mt-2 text-sm text-steel">
            Tell us a little about your goals — a coach will call or message you back.
          </p>

          {/* MARKETING TWEAK: The "Skip the Form" WhatsApp interceptor */}
          <div className="my-7 flex items-center justify-between rounded-sm border border-[#25D366]/30 bg-[#25D366]/10 p-4">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-chalk">Want an instant reply?</span>
              <span className="text-xs text-chalk-dim">Skip the form and message us directly.</span>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
            >
              <MessageCircle size={20} className="fill-current" />
            </a>
          </div>

          <div className="flex items-center gap-4 py-2">
            <div className="h-px flex-1 bg-line" />
            <span className="text-stencil text-[0.65rem] text-steel-dim uppercase tracking-wider">Or fill the form</span>
            <div className="h-px flex-1 bg-line" />
          </div>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
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
                Message (Optional)
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                value={form.message}
                onChange={handleChange}
                className="mt-2 w-full resize-none border border-line-strong bg-panel-2 px-4 py-3 text-chalk placeholder:text-steel-dim outline-none transition-colors duration-200 focus:border-plate-red focus:ring-1 focus:ring-plate-red/30"
                placeholder="Which plan are you interested in?"
              />
            </div>

            <label
              htmlFor="wantsDemo"
              className="group flex cursor-pointer items-start gap-3 border border-plate-red/30 bg-plate-red/5 px-4 py-3.5 transition-colors hover:border-plate-red/50"
            >
              <input
                id="wantsDemo"
                name="wantsDemo"
                type="checkbox"
                checked={form.wantsDemo}
                onChange={(e) => setForm((f) => ({ ...f, wantsDemo: e.target.checked }))}
                className="mt-0.5 h-4 w-4 shrink-0 accent-plate-red cursor-pointer"
              />
              <span className="text-sm text-chalk-dim">
                <span className="inline-flex items-center gap-1.5 font-semibold text-chalk group-hover:text-plate-yellow transition-colors">
                  <Flame size={14} className="text-plate-red group-hover:text-plate-yellow transition-colors" strokeWidth={2.5} />
                  I'd like to book my {FREE_DEMO.short.toLowerCase()}
                </span>
                <br />
                {/* MARKETING TWEAK: Added scarcity injection. Limited capacity implies high demand and protects gym value. */}
                {FREE_DEMO.body} <span className="font-semibold text-plate-red/80">Limited to 5 demos per day. BOOK NOW!</span>
              </span>
            </label>

            <label
              htmlFor="wantsWhatsappUpdates"
              className="group flex cursor-pointer items-start gap-3 border border-line-strong px-4 py-3.5 transition-colors hover:border-chalk"
            >
              <input
                id="wantsWhatsappUpdates"
                name="wantsWhatsappUpdates"
                type="checkbox"
                checked={form.wantsWhatsappUpdates}
                onChange={(e) => setForm((f) => ({ ...f, wantsWhatsappUpdates: e.target.checked }))}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#25D366] cursor-pointer"
              />
              <span className="text-sm text-chalk-dim">
                <span className="inline-flex items-center gap-1.5 font-semibold text-chalk">
                  Also message me updates &amp; demo reminders on WhatsApp
                </span>
                <br />
                A few helpful nudges, never spam — reply STOP anytime to opt out.
              </span>
            </label>

            <div className="border border-line-strong px-4 py-3.5">
              <p className="text-sm font-semibold text-chalk">Tell us a bit about yourself</p>
              <p className="mt-0.5 text-xs text-steel-dim">
                Optional — helps us point you to the right slots and trainer.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {TAG_OPTIONS.map((tag) => {
                  const active = form.tags.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      aria-pressed={active}
                      className={`text-stencil border px-3 py-2 text-xs font-bold tracking-[0.04em] transition-colors ${
                        active
                          ? "border-plate-yellow bg-plate-yellow/10 text-plate-yellow"
                          : "border-line-strong text-chalk-dim hover:border-chalk hover:text-chalk"
                      }`}
                    >
                      {tag.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={status === "loading"}
              // MARKETING TWEAK: Higher intent CTA copy
              className="text-stencil mt-2 flex items-center justify-center gap-2 bg-plate-red px-6 py-4 text-sm font-bold tracking-[0.12em] text-chalk transition-all hover:bg-plate-red-dim hover:shadow-[0_0_20px_rgba(214,40,40,0.3)] disabled:opacity-60"
            >
              {status === "loading" ? "Sending..." : (
                <>
                  Request Callback & Details <Send size={16} />
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
                <AlertCircle size={16} /> Couldn't send that — tap the WhatsApp button above instead!
              </p>
            )}
          </form>
        </Reveal>
      </section>
    </div>
  );
}