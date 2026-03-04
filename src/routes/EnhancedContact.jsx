import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowRightCircle,
  Briefcase,
  Clock,
  Mail,
  Phone,
} from "lucide-react";
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

const TRUSTED_COMPANIES = [
  { name: "Euphoria", icon: "EUPH" },
  { name: "Focal Point", icon: "FOCAL" },
  { name: "45 Degrees", icon: "45" },
  { name: "CoreOS", icon: "CORE" },
  { name: "EasyTax", icon: "TAX" },
  { name: "Epicurious", icon: "EPIC" },
];

const TESTIMONIALS = [
  {
    quote:
      "Fast delivery, clear communication, and very high design quality across all assets.",
    author: "Komal Junghari",
    role: "Founder",
  },
  {
    quote:
      "Vibha Art translated our rough ideas into a polished identity and campaign system.",
    author: "Neha R",
    role: "Marketing Lead",
  },
  {
    quote:
      "From concept to print output, everything was handled in one smooth workflow.",
    author: "Rahul S",
    role: "Business Owner",
  },
];

const PROJECTS = [
  {
    id: "identity-suite",
    title: "Identity Suite",
    year: "2025",
    image: contactSlideOne,
  },
  {
    id: "packaging-launch",
    title: "Packaging Launch",
    year: "2024",
    image: contactSlideTwo,
  },
  {
    id: "campaign-bundle",
    title: "Campaign Bundle",
    year: "2024",
    image: contactSlideThree,
  },
];

const SERVICES_OPTIONS = [
  "Brand Identity",
  "Packaging Design",
  "Social Media Design",
  "Print Design",
  "Website Creative",
  "Other",
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: "easeOut" },
};

const TickerItem = ({ item }) => (
  <div className="flex h-8 items-center justify-center whitespace-nowrap px-6 text-sm font-bold tracking-tight text-neutral-400">
    {item.icon}
    <span className="ml-2 text-[10px] font-normal uppercase tracking-widest opacity-60">
      {item.name}
    </span>
  </div>
);

const EnhancedContact = () => {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
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
        })),
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
        source: "contact-page-folder-layout",
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
    <div className="relative min-h-screen bg-[#fafafa] pt-[6.5rem]">
      <aside className="z-10 w-full border-b border-black/5 bg-[#f5f5f5] p-8">
        <div className="flex h-full flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h1 className="text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#0f0f12] lg:text-4xl">
                Bold design and print execution for serious growing brands.
              </h1>
              <p className="mt-3 text-base leading-relaxed text-[#0f0f12]/80">
                Share your project and we will shape a clear, premium, and
                production-ready visual direction.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="#contact-form"
                className="inline-flex items-center gap-2 rounded-full bg-[#01334C] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#0a4a6d]"
              >
                Start a project
                <ArrowRightCircle size={18} />
              </a>
              <a
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-[#DB5056] bg-[#DB5056] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#c6454b]"
              >
                About Us
              </a>
            </div>
          </div>

          <div className="mt-10 space-y-8">
            <div>
              <h3 className="text-xl font-medium text-[#0f0f12]">
                Trusted by ambitious businesses.
              </h3>
              <div className="relative mt-3 h-8 overflow-hidden">
                {trustedLogos.length > 0 ? (
                  <motion.div
                    className="absolute left-0 top-0 flex h-full items-center"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 22, ease: "linear", repeat: Infinity }}
                  >
                    {[...trustedLogos, ...trustedLogos].map((logo, index) => (
                      <div
                        key={`${logo.name}-${index}`}
                        className="flex h-8 w-24 shrink-0 items-center justify-center px-3"
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
                  </motion.div>
                ) : (
                  <motion.div
                    className="absolute left-0 top-0 flex h-full"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 18, ease: "linear", repeat: Infinity }}
                  >
                    {[...TRUSTED_COMPANIES, ...TRUSTED_COMPANIES].map((company, index) => (
                      <TickerItem key={`${company.name}-${index}`} item={company} />
                    ))}
                  </motion.div>
                )}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#f5f5f5] to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#f5f5f5] to-transparent" />
              </div>
            </div>

            <div className="max-w-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                >
                  <p className="text-sm italic text-black/90">
                    {TESTIMONIALS[testimonialIndex].quote}
                  </p>
                  <p className="mt-2 text-sm text-black/60">
                    {TESTIMONIALS[testimonialIndex].author} - {TESTIMONIALS[testimonialIndex].role}
                  </p>
                </motion.div>
              </AnimatePresence>
              <div className="mt-4 flex gap-1.5">
                {TESTIMONIALS.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setTestimonialIndex(index)}
                    className={`h-1.5 rounded-full transition-all ${index === testimonialIndex ? "w-4" : "w-1.5"}`}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#01334C" : "#DB5056",
                      opacity: index === testimonialIndex ? 1 : 0.35,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="w-full bg-[#fafafa] p-6 md:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          {PROJECTS.map((project) => (
            <motion.div
              key={project.id}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-sm"
              {...fadeInUp}
            >
              <img
                src={project.image}
                alt={project.title}
                className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#191775]/85 via-[#191775]/20 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-6 opacity-0 transition duration-500 group-hover:opacity-100">
                <div className="flex items-center gap-2 text-white">
                  <span className="text-2xl font-medium">{project.title}</span>
                  <ArrowRight className="h-5 w-5 -rotate-45" />
                </div>
                <span className="text-lg text-white/90">{project.year}</span>
              </div>
            </motion.div>
          ))}

          <motion.section
            id="contact-form"
            className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8"
            {...fadeInUp}
          >
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-black">Contact Form</h2>
              <p className="mt-1 text-sm text-[#595959]">
                Tell us what you are building and we will get back quickly.
              </p>
            </div>

            {status === "success" && (
              <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Message sent successfully. We will contact you soon.
              </div>
            )}
            {status === "error" && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Submission failed. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-[13px] text-black">Name</span>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-10 rounded-full bg-[#bbbbbb26] px-4 text-sm outline-none ring-0 focus:ring-1 focus:ring-black/20"
                    placeholder="Jane Smith"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[13px] text-black">Email</span>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="h-10 rounded-full bg-[#bbbbbb26] px-4 text-sm outline-none ring-0 focus:ring-1 focus:ring-black/20"
                    placeholder="jane@company.com"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-[13px] text-black">Mobile</span>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    required
                    className="h-10 rounded-full bg-[#bbbbbb26] px-4 text-sm outline-none ring-0 focus:ring-1 focus:ring-black/20"
                    placeholder="9876543210"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[13px] text-black">Service</span>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    required
                    className="h-10 rounded-full bg-[#bbbbbb26] px-4 text-sm outline-none ring-0 focus:ring-1 focus:ring-black/20"
                  >
                    <option value="" disabled>
                      Select...
                    </option>
                    {SERVICES_OPTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="flex flex-col gap-2">
                <span className="text-[13px] text-black">Project Brief</span>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="rounded-2xl bg-[#bbbbbb26] px-4 py-3 text-sm outline-none ring-0 focus:ring-1 focus:ring-black/20"
                  placeholder="Describe your project..."
                />
              </label>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#595959]">
                  <span className="inline-flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    12 hours typical response
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    vibhart07@gmail.com
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    +91 98765 43210
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#DB5056] px-7 text-sm font-semibold text-white transition hover:bg-[#c6454b] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Briefcase className="h-4 w-4" />
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default EnhancedContact;
