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
import heroBg from "../assets/Contact/ChatGPT Image May 17, 2026, 01_10_55 AM.png";
import mapBg from "../assets/Contact/ChatGPT Image May 17, 2026, 01_12_51 AM.png";
import envelopeArt from "../assets/Contact/ChatGPT Image May 17, 2026, 01_17_28 AM.png";
import ctaBg from "../assets/Contact/ChatGPT Image May 17, 2026, 02_02_25 AM.png";
import fastResponseIcon from "../assets/Contact/Icons/ChatGPT Image May 17, 2026, 01_25_16 AM.png";
import expertSupportIcon from "../assets/Contact/Icons/ChatGPT Image May 17, 2026, 01_24_50 AM.png";
import projectDiscussionIcon from "../assets/Contact/Icons/ChatGPT Image May 17, 2026, 01_26_28 AM.png";

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
    lines: ["+91 86259 48046", "+91 86249 48046"],
  },
  {
    icon: <Mail size={26} />,
    title: "Email",
    lines: ["hello@vibhaprints.com", "info@vibhaprints.com"],
  },
  {
    icon: <MapPin size={26} />,
    title: "Location",
    lines: ["123, Creative Street, Design City,", "Ahmedabad, Gujarat 380001"],
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
    <div className="min-h-screen bg-[#f7f9fc] text-[#071124]">
      <section
        className="relative overflow-hidden bg-[#f8fafc] pt-28 pb-12 sm:pt-32 lg:pt-[10.25rem] lg:pb-16"
        style={{
          backgroundImage: `url("${heroBg}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 mx-auto grid w-full items-center gap-9 px-4 sm:px-6 md:px-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:px-16 xl:px-20">
          <div>
            <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.18em] text-[#ff3344] sm:mb-7 sm:tracking-[0.24em]">
              Get In Touch
            </p>
            <h1
              className="mb-5 max-w-xl text-[34px] font-black leading-[1.08] md:text-[58px]"
              style={{
                color: "#071124",
                background: "none",
                WebkitTextFillColor: "currentColor",
              }}
            >
              Let's Create
              <span className="block text-[#f23b4d]">
                <span className="block md:inline">Something</span>{" "}
                <span className="block md:inline">Amazing</span>
              </span>
            </h1>
            <div className="mb-7 h-1 w-12 rounded-full bg-[#ff3344]" />
            <p className="max-w-[560px] text-[15px] leading-7 text-[#4f5d72] sm:text-[17px] sm:leading-8">
              Have a project in mind or just want to say hello? We'd love to
              hear from you. Fill out the form and our team will get back to you
              shortly.
            </p>

            <div className="mt-9 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-7">
              {contactCards.map((item) => (
                <div key={item.title} className="flex items-center gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center sm:h-24 sm:w-24">
                    <img
                      src={item.icon}
                      alt=""
                      aria-hidden="true"
                      className="h-16 w-16 object-contain sm:h-24 sm:w-24"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-extrabold text-[#071124]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#5f6b7d]">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[640px]">
            <form
              onSubmit={handleSubmit}
              className="relative rounded-2xl bg-[#071426] p-4 shadow-[0_20px_50px_rgba(7,17,36,0.24)] sm:p-7 md:rounded-[24px] md:p-12"
            >
              <h2 className="mb-2 text-xl font-extrabold text-white sm:text-2xl md:text-3xl">
                Send Us a Message
              </h2>
              <div className="mb-6 text-3xl font-black leading-none text-[#ff3344] sm:mb-9">
                ~~
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <input
                  className="h-14 rounded-lg border border-white/18 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-white/68 focus:border-[#ff3344] sm:h-16 sm:px-6 sm:text-base"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                />
                <input
                  type="email"
                  className="h-14 rounded-lg border border-white/18 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-white/68 focus:border-[#ff3344] sm:h-16 sm:px-6 sm:text-base"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                />
                <input
                  type="tel"
                  className="h-14 rounded-lg border border-white/18 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-white/68 focus:border-[#ff3344] sm:h-16 sm:px-6 sm:text-base"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  required
                />
                <input
                  className="h-14 rounded-lg border border-white/18 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-white/68 focus:border-[#ff3344] sm:h-16 sm:px-6 sm:text-base"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => updateField("subject", e.target.value)}
                  required
                />
              </div>
              <textarea
                className="mt-5 h-36 w-full resize-none rounded-lg border border-white/18 bg-white/[0.03] px-4 py-4 text-sm text-white outline-none transition placeholder:text-white/68 focus:border-[#ff3344] sm:h-44 sm:px-6 sm:py-6 sm:text-base"
                placeholder="Tell us about your project..."
                value={formData.message}
                onChange={(e) => updateField("message", e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#ff3344] px-5 text-sm font-extrabold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] transition hover:bg-[#fa4b5a] disabled:opacity-70 sm:h-16 sm:px-8 sm:text-base"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <span className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 sm:h-10 sm:w-10">
                  <ChevronRight size={20} />
                </span>
              </button>
            </form>
          </div>
        </div>
      </section>

      <section
        className="bg-[#061426] py-14 text-white sm:py-20"
        style={{
          backgroundImage: `url("${mapBg}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto grid w-full gap-10 px-4 sm:px-6 md:px-12 lg:grid-cols-[360px_1fr] lg:gap-14 lg:px-16 xl:px-20">
          <div>
            <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.24em] text-[#ff3344]">
              Contact Information
            </p>
            <h2 className="mb-8 text-2xl font-black text-white sm:text-3xl md:text-4xl">
              We're Here to Help
            </h2>
            <div className="space-y-7">
              {infoItems.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 border-b border-white/12 pb-6 last:border-b-0 sm:gap-5 sm:pb-7"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-[#ff3344] sm:h-16 sm:w-16">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="mb-2 text-base font-extrabold text-white">
                      {item.title}
                    </h3>
                    {item.lines.map((line) => (
                      <p key={line} className="text-sm leading-6 text-white/84">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[340px] overflow-hidden rounded-2xl shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:min-h-[430px]">
            <div className="absolute inset-x-4 bottom-4 rounded-xl bg-[#071426] p-5 shadow-2xl sm:bottom-auto sm:left-10 sm:top-1/2 sm:w-[260px] sm:-translate-y-1/2 sm:p-8">
              <h3 className="mb-4 text-xl font-black text-[#ff3344]">
                Vibha Prints
              </h3>
              <p className="text-sm leading-7 text-white/88">
                123, Creative Street,
                <br />
                Design City, Ahmedabad,
                <br />
                Gujarat 380001
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold text-[#ff3344]"
              >
                Get Directions <ArrowRight size={16} />
              </a>
            </div>
            <div className="absolute bottom-5 right-5 grid overflow-hidden rounded-lg bg-[#071426] text-white">
              <button className="h-9 w-9 border-b border-white/10 text-lg">+</button>
              <button className="h-9 w-9 text-lg">-</button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f9fc] py-14 sm:py-20">
        <div className="mx-auto w-full px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-14">
            <div>
              <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.24em] text-[#ff3344]">
                FAQs
              </p>
              <h2 className="mb-8 text-2xl font-black text-[#071124] sm:text-3xl md:text-4xl">
                Frequently Asked{" "}
                <span className="text-[#ff3344]">Questions</span>
              </h2>
              <div className="space-y-6">
                {faqs.map((faq) => (
                  <button
                    key={faq}
                    className="flex min-h-16 w-full items-center justify-between gap-4 rounded-xl bg-white px-4 py-4 text-left shadow-[0_12px_30px_rgba(7,17,36,0.08)] sm:h-20 sm:px-7 sm:py-0"
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
              <p className="mb-6 max-w-[430px] text-left text-sm leading-7 text-[#5f6b7d] sm:mb-8 sm:text-base sm:leading-8">
                Here are some common questions. Can't find the answer you're
                looking for? Contact us directly.
              </p>
              <img
                src={envelopeArt}
                alt="Vibha Prints message envelope"
                className="w-full max-w-[320px] object-contain sm:max-w-[440px]"
                loading="lazy"
              />
            </div>
          </div>

          <div
            className="mt-14 overflow-hidden rounded-2xl bg-[#071426] px-5 py-9 text-white sm:mt-20 sm:px-10 sm:py-12 md:px-16"
            style={{
              backgroundImage: `url("${ctaBg}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div>
                <h2 className="mb-3 text-2xl font-black text-white sm:text-3xl md:text-4xl">
                  Ready to Start{" "}
                  <span className="text-[#ff3344]">Your Project?</span>
                </h2>
                <p className="text-white/82">
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
