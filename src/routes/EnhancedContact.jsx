import React, { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Plus,
  Send,
} from "lucide-react";
import { submitContactLead } from "../services/supabaseLeadService";
import { useToast } from "../components/ui/ToastProvider";
import heroBg from "../assets/Contact/image-045.webp";
import mapBg from "../assets/Contact/image-046.webp";
import envelopeArt from "../assets/Contact/image-047.webp";
import ctaBg from "../assets/Contact/image-048.webp";
import fastResponseIcon from "../assets/Contact/Icons/image-050.webp";
import expertSupportIcon from "../assets/Contact/Icons/image-049.webp";
import projectDiscussionIcon from "../assets/Contact/Icons/image-051.webp";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const contactCards = [
  {
    icon: fastResponseIcon,
    title: "Fast Response",
    text: "We reply within 24 hours",
  },
  {
    icon: expertSupportIcon,
    title: "Expert Support",
    text: "Get solution from our expert",
  },
  {
    icon: projectDiscussionIcon,
    title: "Project Discussion",
    text: "Let's discuss your idea",
  },
];

const infoItems = [
  {
    icon: <Phone size={26} />,
    title: "Phone",
    lines: ["+91 86249 48046"],
  },
  {
    icon: <Mail size={26} />,
    title: "Email",
    lines: ["info@vibhaprints.com", "vibhart07@gmail.com"],
  },
  {
    icon: <MapPin size={26} />,
    title: "Location",
    lines: ["Pune SB Road"],
  },
  {
    icon: <Clock3 size={26} />,
    title: "Business Hours",
    lines: ["Mon - Sat: 9:00 AM - 7:00 PM", "Sunday: Closed"],
  },
];

const faqs = [
  "What services do you offer?",
  "How long does a project take?",
  "Do you work with startups?",
  "Can you help with brand strategy?",
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const EnhancedContact = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!EMAIL_REGEX.test(formData.email.trim())) {
      showToast("Please enter a valid email address.", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitContactLead({
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.phone.trim(),
        message: `${formData.subject.trim()} | ${formData.message.trim()}`,
        source: "contact-page-redesign",
      });
      showToast("Message sent successfully.", "success");
      setFormData(initialForm);
    } catch (error) {
      console.error("Contact form submission failed", error);
      showToast("Submission failed. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f7f9fc] text-[#071124]">
      <section
        className="relative w-full max-w-full overflow-hidden bg-[#f8fafc] pb-10 pt-28 sm:pb-12 sm:pt-32 lg:pb-16 lg:pt-[10.25rem]"
      >
        <picture>
          <img
            src={heroBg}
            alt="Vibha Prints contact desk"
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="eager"
            decoding="async"
          />
        </picture>
        <div className="absolute inset-0 bg-white/88 sm:bg-white/68 lg:bg-white/42" />
        <div className="relative z-10 mx-auto grid w-full max-w-[1440px] min-w-0 items-start gap-8 px-4 sm:px-6 md:px-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-12 lg:px-16 xl:px-20">
          <div className="min-w-0 max-w-[640px]">
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#ff3344] sm:mb-7 sm:text-xs sm:tracking-[0.24em]">
              Get In Touch
            </p>
            <h1
              className="mb-4 max-w-xl text-[clamp(1.9rem,10vw,3.6rem)] font-black leading-[1.04] sm:mb-5 md:text-[58px]"
              style={{
                color: "#071124",
                background: "none",
                WebkitTextFillColor: "currentColor",
              }}
            >
              Let's Create
              <span className="block text-[#f23b4d] sm:whitespace-nowrap">
                Something Amazing
              </span>
            </h1>
            <div className="mb-5 h-1 w-12 rounded-full bg-[#ff3344] sm:mb-7" />
            <p className="max-w-[560px] text-sm leading-7 text-[#4f5d72] sm:text-[17px] sm:leading-8">
              Have a project in mind or just want to say hello? We'd love to
              hear from you. Fill out the form and our team will get back to you
              shortly.
            </p>

            <div className="mt-7 grid min-w-0 gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-7">
              {contactCards.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-4 rounded-xl border border-[#eef2f7] bg-white/92 p-4 shadow-[0_12px_30px_rgba(7,17,36,0.08)] backdrop-blur sm:gap-5 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center sm:h-24 sm:w-24">
                    <img
                      src={item.icon}
                      alt="Contact Vibha Art - Printing Services Pune"
                      aria-hidden="true"
                      className="h-14 w-14 object-contain sm:h-24 sm:w-24"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-extrabold text-[#071124] sm:text-base">
                      {item.title}
                    </h3>
                    <p className="text-xs leading-5 text-[#5f6b7d] sm:text-sm">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full min-w-0 max-w-[640px]">
            <form
              onSubmit={handleSubmit}
              className="relative w-full min-w-0 max-w-full overflow-hidden rounded-2xl bg-[#071426] p-4 shadow-[0_20px_50px_rgba(7,17,36,0.24)] sm:p-7 md:rounded-[24px] md:p-12"
            >
              <h2 className="mb-2 text-xl font-extrabold leading-tight text-white sm:text-2xl md:text-3xl">
                Send Us a Message
              </h2>
              <div className="mb-5 text-3xl font-black leading-none text-[#ff3344] sm:mb-9">
                ~~
              </div>
              <div className="grid min-w-0 gap-3 sm:gap-5 md:grid-cols-2">
                <input
                  className="h-12 w-full min-w-0 rounded-lg border border-white/18 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-white/68 focus:border-[#ff3344] sm:h-16 sm:px-6 sm:text-base"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                />
                <input
                  type="email"
                  className="h-12 w-full min-w-0 rounded-lg border border-white/18 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-white/68 focus:border-[#ff3344] sm:h-16 sm:px-6 sm:text-base"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                />
                <input
                  type="tel"
                  className="h-12 w-full min-w-0 rounded-lg border border-white/18 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-white/68 focus:border-[#ff3344] sm:h-16 sm:px-6 sm:text-base"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  required
                />
                <input
                  className="h-12 w-full min-w-0 rounded-lg border border-white/18 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-white/68 focus:border-[#ff3344] sm:h-16 sm:px-6 sm:text-base"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => updateField("subject", e.target.value)}
                  required
                />
              </div>
              <textarea
                className="mt-3 h-32 w-full min-w-0 resize-none rounded-lg border border-white/18 bg-white/[0.03] px-4 py-4 text-sm text-white outline-none transition placeholder:text-white/68 focus:border-[#ff3344] sm:mt-5 sm:h-44 sm:px-6 sm:py-6 sm:text-base"
                placeholder="Tell us about your project..."
                value={formData.message}
                onChange={(e) => updateField("message", e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-5 flex h-12 w-full min-w-0 items-center justify-center gap-3 rounded-full bg-[#ff3344] px-5 text-sm font-extrabold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] transition hover:bg-[#fa4b5a] disabled:opacity-70 sm:mt-6 sm:h-16 sm:px-8 sm:text-base"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <span className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 sm:h-10 sm:w-10">
                  <ChevronRight size={20} />
                </span>
              </button>
            </form>
          </div>
        </div>
      </section>

      <section
        className="bg-[#061426] py-12 text-white sm:py-20"
        style={{
          backgroundImage: `url("${mapBg}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto w-full max-w-[760px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
          <div>
            <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.24em] text-[#ff3344]">
              Contact Information
            </p>
            <h2 className="mb-7 text-2xl font-black leading-tight text-white sm:mb-8 sm:text-3xl md:text-4xl">
              We're Here to Help
            </h2>
            <div className="space-y-5 sm:space-y-7">
              {infoItems.map((item) => (
                <div
                  key={item.title}
                  className="flex min-w-0 gap-4 border-b border-white/12 pb-5 last:border-b-0 sm:gap-5 sm:pb-7"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-[#ff3344] sm:h-16 sm:w-16">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="mb-2 text-base font-extrabold text-white">
                      {item.title}
                    </h3>
                    {item.lines.map((line) => (
                      <p key={line} className="break-words text-sm leading-6 text-white/84">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <section className="bg-[#f7f9fc] py-12 sm:py-20">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-14">
            <div>
              <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.24em] text-[#ff3344]">
                FAQs
              </p>
              <h2 className="mb-7 text-2xl font-black leading-tight text-[#071124] sm:mb-8 sm:text-3xl md:text-4xl">
                Frequently Asked{" "}
                <span className="text-[#ff3344]">Questions</span>
              </h2>
              <div className="space-y-4 sm:space-y-6">
                {faqs.map((faq) => (
                  <button
                    key={faq}
                    className="flex min-h-16 w-full items-center justify-between gap-3 rounded-xl bg-white px-4 py-4 text-left shadow-[0_12px_30px_rgba(7,17,36,0.08)] sm:h-20 sm:gap-4 sm:px-7 sm:py-0"
                  >
                    <span className="flex min-w-0 items-center gap-3 text-sm font-extrabold leading-5 text-[#071124] sm:gap-5 sm:text-base">
                      <CheckCircle2 className="shrink-0 text-[#ff3344]" size={21} />
                      {faq}
                    </span>
                    <Plus className="shrink-0" size={24} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center text-center lg:pt-6">
              <p className="mb-6 max-w-[430px] text-center text-sm leading-7 text-[#5f6b7d] sm:mb-8 sm:text-left sm:text-base sm:leading-8">
                Here are some common questions. Can't find the answer you're
                looking for? Contact us directly.
              </p>
              <img
                src={envelopeArt}
                alt="Vibha Prints message envelope"
                className="w-full max-w-[260px] object-contain sm:max-w-[440px]"
                loading="lazy"
              />
            </div>
          </div>

          <div
            className="mt-12 overflow-hidden rounded-2xl bg-[#071426] px-5 py-8 text-white sm:mt-20 sm:px-10 sm:py-12 md:px-16"
            style={{
              backgroundImage: `url("${ctaBg}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div>
                <h2 className="mb-3 text-2xl font-black leading-tight text-white sm:text-3xl md:text-4xl">
                  Ready to Start{" "}
                  <span className="text-[#ff3344]">Your Project?</span>
                </h2>
                <p className="text-sm leading-7 text-white/82 sm:text-base">
                  Let's turn your ideas into a powerful brand experience.
                </p>
              </div>
              <a
                href="#"
                className="inline-flex h-14 w-full items-center justify-center gap-4 rounded-full bg-[#ff3344] px-6 text-sm font-extrabold text-white transition hover:bg-[#fa4b5a] sm:h-16 sm:w-auto sm:min-w-[250px] sm:px-8 sm:text-base"
              >
                Start a Project
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                  <ArrowRight size={18} />
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EnhancedContact;
