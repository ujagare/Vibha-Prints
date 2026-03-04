import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { submitContactLead } from "../services/supabaseLeadService";
import contactSlideOne from "../assets/vibha contact1.png";
import contactSlideTwo from "../assets/vibha contact2.png";
import contactSlideThree from "../assets/vibha contact.png";

const pngLogoModules = import.meta.glob("../assets/png logos/*.png", {
  eager: true,
  import: "default",
});

const formatLogoName = (path) =>
  path
    .split("/")
    .pop()
    ?.replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim() ?? "Brand logo";

const SERVICES_OPTIONS = [
  "Brand Identity",
  "Packaging Design",
  "Social Media Design",
  "Print Design",
  "Website Creative",
  "Other",
];

const PROJECTS = [
  { id: "identity-suite", title: "Identity Suite", image: contactSlideOne },
  { id: "packaging-launch", title: "Packaging Launch", image: contactSlideTwo },
  { id: "campaign-bundle", title: "Campaign Bundle", image: contactSlideThree },
];

const EnhancedContact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const trustedLogos = useMemo(
    () =>
      Object.entries(pngLogoModules)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([path, src]) => ({
          name: formatLogoName(path),
          src,
        }))
        .slice(0, 8),
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setIsSubmitting(true);

    try {
      await submitContactLead({
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        message: `${formData.message.trim()} | Service: ${formData.service}`,
        source: "contact-page-vessel-style",
      });

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        mobile: "",
        service: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form submission failed", error);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#efebe4] pt-[6.5rem] text-[#181818]">
      <section className="px-4 pb-8 md:px-8 lg:px-14">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-black/10 bg-[#f8f5ef] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.08)] md:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="inline-flex items-center rounded-full border border-black/20 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-black/70">
                Contact Vibha Art
              </div>

              <div>
                <h1
                  className="max-w-2xl text-4xl leading-[1.04] tracking-[-0.02em] text-[#131313] md:text-5xl lg:text-[4rem]"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  Let&apos;s build a brand presence people remember.
                </h1>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-black/70 md:text-lg">
                  Share your idea, campaign, or product launch. We design, print,
                  and deliver premium creative assets with clear process and quick
                  turnaround.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                  <div className="inline-flex items-center gap-2 text-sm font-medium">
                    <Phone className="h-4 w-4 text-[#01334C]" />
                    Phone
                  </div>
                  <p className="mt-2 text-sm text-black/75">+91 98765 43210</p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                  <div className="inline-flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-4 w-4 text-[#01334C]" />
                    Email
                  </div>
                  <p className="mt-2 break-all text-sm text-black/75">vibhart07@gmail.com</p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                  <div className="inline-flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-[#01334C]" />
                    Location
                  </div>
                  <p className="mt-2 text-sm text-black/75">Nagpur, India</p>
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                <p className="text-sm font-medium text-black/70">Trusted by ambitious businesses.</p>
                <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-8">
                  {trustedLogos.map((logo) => (
                    <div
                      key={logo.name}
                      className="flex h-10 items-center justify-center rounded-lg border border-black/10 bg-white px-2"
                    >
                      <img
                        src={logo.src}
                        alt={logo.name}
                        className="max-h-6 w-auto object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
              className="rounded-[1.75rem] border border-black/10 bg-white p-5 shadow-[0_10px_35px_rgba(0,0,0,0.08)] md:p-6"
            >
              <h2
                className="text-3xl leading-tight tracking-[-0.02em] text-[#131313]"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Start your project
              </h2>
              <p className="mt-2 text-sm text-black/65">
                Fill details and our team will connect within 12 hours.
              </p>

              {status === "success" && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  Message sent successfully. We will contact you soon.
                </div>
              )}
              {status === "error" && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  Submission failed. Please try again.
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Name"
                    className="h-11 rounded-xl border border-black/15 bg-[#faf7f2] px-4 text-sm outline-none transition focus:border-[#01334C]"
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="Email"
                    className="h-11 rounded-xl border border-black/15 bg-[#faf7f2] px-4 text-sm outline-none transition focus:border-[#01334C]"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    required
                    placeholder="Mobile"
                    className="h-11 rounded-xl border border-black/15 bg-[#faf7f2] px-4 text-sm outline-none transition focus:border-[#01334C]"
                  />
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    required
                    className="h-11 rounded-xl border border-black/15 bg-[#faf7f2] px-4 text-sm outline-none transition focus:border-[#01334C]"
                  >
                    <option value="" disabled>
                      Select Service
                    </option>
                    {SERVICES_OPTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  placeholder="Project brief"
                  className="w-full rounded-xl border border-black/15 bg-[#faf7f2] px-4 py-3 text-sm outline-none transition focus:border-[#01334C]"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#01334C] px-6 text-sm font-semibold text-white transition hover:bg-[#0b4b6e] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 md:px-8 lg:px-14">
        <div className="mx-auto max-w-7xl grid gap-4 md:grid-cols-3">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className="group overflow-hidden rounded-2xl border border-black/10 bg-white"
            >
              <img
                src={project.image}
                alt={project.title}
                className="aspect-[16/11] w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="p-4">
                <p className="text-sm font-medium text-black/80">{project.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EnhancedContact;
