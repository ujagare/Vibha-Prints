import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star, Target } from "lucide-react";
import AnimatedNumber from "./AnimatedNumber";

const textFill = { WebkitTextFillColor: "currentColor" };

const SectionBadge = ({ children, light = false }) => (
  <span
    className={`inline-flex max-w-full rounded-full border px-3 py-1.5 text-center text-[10px] font-extrabold uppercase tracking-[0.18em] shadow-sm sm:px-4 sm:text-[11px] sm:tracking-[0.24em] ${
      light
        ? "border-white/15 bg-white/5 text-white"
        : "border-[#e3e7ef] bg-white text-[#071124]"
    }`}
  >
    {children}
  </span>
);

const IconSlot = ({ item, size = 24, imageClassName = "" }) => {
  if (item.iconImage) {
    return (
      <img decoding="async" loading="lazy"
        src={item.iconImage}
        alt="Vibha Art Services - Graphic Design and Printing"
        aria-hidden="true"
        className={`h-full w-full object-contain ${imageClassName}`}
      />
    );
  }

  const Icon = item.icon;
  return Icon ? <Icon size={size} /> : null;
};

const ServiceLandingTemplate = ({ page }) => {
  const navigate = useNavigate();
  const testimonials = page.testimonials || [];
  const loopTestimonials = [...testimonials, ...testimonials, ...testimonials];
  const accent = page.accent || "#ff3f51";
  const cardVariant = page.servicesSection.cardVariant || "media";
  const ctaTextTone = page.cta.textTone || "light";
  const ctaAlign = page.cta.align || "split";
  const processColumnClass =
    page.processSteps.length === 5 ? "xl:grid-cols-5" : "xl:grid-cols-4";

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-white font-['Poppins'] text-[#071124]">
      <section className="relative mt-[96px] min-h-[calc(100svh-96px)] overflow-hidden bg-[#06111f] sm:mt-[104px] sm:min-h-[calc(100vh-104px)]">
        <picture>
          {page.backgrounds.heroMobile && (
            <source media="(max-width: 640px)" srcSet={page.backgrounds.heroMobile} />
          )}
          <img decoding="async" loading="lazy" src={page.backgrounds.hero} alt="Vibha Art Services - Graphic Design and Printing" className="absolute inset-0 h-full w-full object-cover object-top" />
        </picture>
        <div className="container relative z-10 mx-auto flex min-h-[calc(100svh-96px)] max-w-full items-center px-4 py-10 sm:min-h-[calc(100vh-104px)] sm:px-6 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className={
              page.hero.copyClass ||
              "w-full min-w-0 max-w-[calc(100vw-2rem)] pt-10 sm:max-w-xl"
            }
          >
            <p className="mb-4 max-w-full text-[11px] font-extrabold uppercase tracking-[0.22em] sm:mb-5 sm:text-[12px] sm:tracking-[0.32em]" style={{ color: accent }}>
              {page.hero.eyebrow}
            </p>
            <h1
              className={
                page.hero.titleClass ||
                "mb-5 max-w-full break-words !text-[clamp(1.9rem,10.2vw,2.55rem)] font-extrabold !leading-[1.04] text-white sm:mb-6 sm:!text-6xl lg:!text-7xl"
              }
              style={textFill}
            >
              {page.hero.titleLines ? (
                page.hero.titleLines.map((line, lineIndex) => (
                  <span
                    className="block lg:whitespace-nowrap"
                    key={`${line.text}-${lineIndex}`}
                  >
                    {line.text}
                    {line.highlight && (
                      <>
                        {line.text ? " " : ""}
                        <span style={{ color: accent }}>{line.highlight}</span>
                      </>
                    )}
                  </span>
                ))
            ) : (
              <>
                  <span className="block max-w-full break-words">
                    {page.hero.title}
                  </span>
                  <span className="block max-w-full break-words" style={{ color: accent }}>
                    {page.hero.highlight}
                  </span>
                </>
              )}
            </h1>
            <p className="w-full min-w-0 max-w-full rounded-md bg-[#06111f]/62 px-4 py-3 text-sm font-semibold leading-7 text-white shadow-[0_18px_45px_rgba(0,0,0,0.22)] backdrop-blur-sm sm:max-w-[31rem] sm:text-[17px] sm:leading-8">
              {page.hero.description}
            </p>
            <div className={`mt-8 max-w-lg grid-cols-2 gap-4 sm:grid sm:grid-cols-4 ${page.hero.hideStatsOnMobile ? "hidden" : "grid"}`}>
              {page.hero.stats.map((item) => (
                <div key={`${item.title}-${item.label}`} className="group">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-lg border border-white/10 bg-white/8 shadow-[0_18px_40px_rgba(0,0,0,0.22)] backdrop-blur" style={{ color: accent }}>
                    <IconSlot item={item} size={24} imageClassName="p-2" />
                  </div>
                  <AnimatedNumber
                    value={item.title}
                    as="p"
                    className="text-sm font-extrabold leading-5 text-white"
                  />
                  <p className="text-xs font-semibold leading-5 text-white/70">{item.label}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate(page.hero.cta.route)}
              className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_18px_45px_rgba(255,63,81,0.38)] transition hover:-translate-y-1 sm:mt-9 sm:w-auto sm:px-8 sm:py-4"
              style={{ backgroundColor: accent }}
            >
              {page.hero.cta.label} <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </section>

      <section
        className="relative overflow-hidden py-12 sm:py-24"
        style={{ backgroundImage: `url(${page.backgrounds.services})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="container relative z-10 mx-auto max-w-full px-4 sm:px-6">
          <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-12">
            <SectionBadge>{page.servicesSection.badge}</SectionBadge>
            <h2 className="mt-4 !text-[clamp(1.8rem,9vw,2.5rem)] font-extrabold !leading-tight text-[#071124] sm:!text-5xl" style={textFill}>
              {page.servicesSection.title} <span style={{ color: accent }}>{page.servicesSection.highlight}</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm font-medium leading-7 text-[#536176]">
              {page.servicesSection.description}
            </p>
          </div>

          <div className={cardVariant === "image" || cardVariant === "icon" || cardVariant === "premiumIcon" ? "grid min-w-0 gap-5 sm:gap-7 md:grid-cols-2 xl:grid-cols-4" : "grid min-w-0 gap-5 sm:gap-7 md:grid-cols-2 xl:grid-cols-3"}>
            {page.services.map((service, index) => (
              <motion.button
                key={service.title}
                type="button"
                onClick={() => navigate(service.route)}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.04, duration: 0.45 }}
                className={
                  cardVariant === "image"
                    ? "group relative min-h-[310px] w-full min-w-0 overflow-hidden rounded-lg border border-[#edf0f6] bg-white text-left shadow-[0_18px_55px_rgba(7,17,36,0.11)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_100px_rgba(7,17,36,0.18)] sm:min-h-[360px] sm:shadow-[0_24px_80px_rgba(7,17,36,0.12)]"
                    : cardVariant === "icon"
                      ? "group relative min-h-[220px] w-full min-w-0 overflow-hidden rounded-lg border border-[#edf0f6] bg-white p-5 text-left shadow-[0_18px_55px_rgba(7,17,36,0.09)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_100px_rgba(7,17,36,0.15)] sm:min-h-[260px] sm:p-7 sm:shadow-[0_24px_80px_rgba(7,17,36,0.09)]"
                      : cardVariant === "premiumIcon"
                        ? "group relative min-h-[220px] w-full min-w-0 overflow-hidden rounded-lg border border-[#edf0f6] bg-white p-5 text-left shadow-[0_18px_55px_rgba(7,17,36,0.09)] sm:min-h-[260px] sm:p-7 sm:shadow-[0_24px_80px_rgba(7,17,36,0.09)]"
                      : "group relative flex min-h-[220px] w-full min-w-0 flex-col overflow-hidden rounded-lg border border-white/80 bg-white/90 p-4 text-left shadow-[0_18px_55px_rgba(7,17,36,0.1)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_34px_100px_rgba(7,17,36,0.18)] sm:grid sm:min-h-[230px] sm:grid-cols-[minmax(0,1fr)_158px] sm:gap-5 sm:p-6 sm:shadow-[0_26px_90px_rgba(7,17,36,0.11)]"
                }
              >
                <span className={`absolute inset-x-0 top-0 h-1 ${cardVariant === "premiumIcon" ? "opacity-100" : "opacity-0 transition group-hover:opacity-100"}`} style={{ background: `linear-gradient(90deg, ${accent}, #ff7a59, #6f63ff)` }} />
                <span className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full blur-3xl transition" style={{ backgroundColor: `${accent}1a` }} />
                <span className="pointer-events-none absolute -bottom-20 left-8 h-32 w-32 rounded-full bg-[#486cff]/10 blur-3xl" />

                {cardVariant === "image" ? (
                  <>
                    <span className="relative block h-40 overflow-hidden bg-[#eef1f5] sm:h-44">
                      <img decoding="async" loading="lazy" src={service.image} alt={service.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                      <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-white shadow-[0_12px_28px_rgba(255,63,81,0.32)]" style={{ backgroundColor: accent }}>
                        <IconSlot item={service} size={18} imageClassName="p-1.5" />
                      </span>
                    </span>
                    <span className="relative z-10 block p-5 sm:p-6">
                      <span className="text-lg font-extrabold leading-tight text-[#071124]">{service.title}</span>
                      <span className="mt-3 block text-sm font-medium leading-7 text-[#667085]">{service.description}</span>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold" style={{ color: accent }}>
                        Explore More <ArrowRight size={15} />
                      </span>
                    </span>
                  </>
                ) : cardVariant === "icon" || cardVariant === "premiumIcon" ? (
                    <span className="relative z-10 flex h-full min-w-0 flex-col">
                    <span
                      className={
                        cardVariant === "premiumIcon"
                          ? "relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/70 bg-[linear-gradient(145deg,#ffffff,#eef4ff)] text-[#ff3f51] shadow-[0_18px_42px_rgba(255,63,81,0.18)] sm:mb-7 sm:h-16 sm:w-16"
                          : "mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4f0ff] text-[#5d56ff] shadow-[0_16px_34px_rgba(93,86,255,0.12)] sm:mb-7 sm:h-16 sm:w-16"
                      }
                    >
                      <IconSlot item={service} size={30} imageClassName="p-3" />
                    </span>
                    <span className={cardVariant === "premiumIcon" ? "relative text-lg font-extrabold leading-tight text-[#071124]" : "text-lg font-extrabold leading-tight text-[#071124]"}>{service.title}</span>
                    <span className={cardVariant === "premiumIcon" ? "relative mt-4 flex-1 text-sm font-medium leading-7 text-[#667085]" : "mt-4 flex-1 text-sm font-medium leading-7 text-[#667085]"}>{service.description}</span>
                    <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-extrabold" style={{ color: accent }}>
                      Explore More <ArrowRight size={15} />
                    </span>
                  </span>
                ) : (
                  <>
                    <span className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col">
                      <span className="mb-5 flex items-center justify-between gap-4">
                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#eceeff] bg-[linear-gradient(145deg,#ffffff,#f2f4ff)] text-[#5d56ff] shadow-[0_16px_35px_rgba(82,91,255,0.16)] transition group-hover:border-[#ffd6dc]" style={{ color: service.iconColor || "#5d56ff" }}>
                          <IconSlot item={service} size={24} imageClassName="p-2.5" />
                        </span>
                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#edf0f6] bg-white text-[#071d34] shadow-[0_10px_25px_rgba(7,17,36,0.08)] transition group-hover:text-white">
                          <ArrowRight size={16} />
                        </span>
                      </span>
                      <span className="text-lg font-extrabold leading-tight text-[#071124] sm:text-xl">{service.title}</span>
                      <span className="mt-3 text-sm font-medium leading-7 text-[#667085]">{service.description}</span>
                      <span className="mt-5 inline-flex w-max items-center rounded-full border border-[#eef1f7] bg-[#f8fafc] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#071d34] transition">
                        {service.tag || page.servicesSection.cardTag}
                      </span>
                    </span>

                    <span className="relative z-10 mt-5 flex h-[132px] min-w-0 items-center justify-center overflow-hidden rounded-lg border border-[#edf0f6] bg-[linear-gradient(145deg,#f8fafc,#ffffff)] shadow-inner sm:mt-0 sm:h-full">
                      <span className="absolute inset-3 rounded-md border border-white bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]" />
                      <img decoding="async" loading="lazy"
                        src={service.image}
                        alt={service.title}
                        className="relative z-10 h-full max-h-[145px] w-full object-contain p-3 drop-shadow-[0_16px_22px_rgba(7,17,36,0.16)] transition duration-300 group-hover:scale-105 sm:max-h-[160px]"
                      />
                      <span className="absolute bottom-3 left-3 h-2 w-14 rounded-full opacity-80 shadow-[0_0_22px_rgba(255,63,81,0.55)]" style={{ backgroundColor: accent }} />
                      <span className="absolute right-3 top-3 rounded-full border border-white/80 bg-white/85 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#071d34] shadow-sm">
                        View
                      </span>
                    </span>
                  </>
                )}
              </motion.button>
            ))}
          </div>

          <div className="mt-10 text-center sm:mt-12">
            <button
              onClick={() => navigate(page.servicesSection.cta.route)}
              className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_16px_38px_rgba(255,63,81,0.34)] transition hover:-translate-y-1 hover:bg-[#071d34] sm:w-auto sm:px-9 sm:py-4"
              style={{ backgroundColor: accent }}
            >
              {page.servicesSection.cta.label} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <section
        className="relative overflow-hidden bg-[#06111f] py-12 text-white sm:py-24"
      >
        <img
          decoding="async"
          loading="lazy"
          src={page.backgrounds.process}
          alt={`${page.processSection.title} ${page.processSection.highlight} ${page.processSection.suffix} by Vibha Art`}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        />
        <span className="pointer-events-none absolute inset-0 bg-[#06111f]/28" />
        <div className="container relative z-10 mx-auto max-w-full px-4 sm:px-6">
          <div className="mx-auto mb-9 max-w-3xl text-center sm:mb-14">
            <SectionBadge light>{page.processSection.badge}</SectionBadge>
            <h2 className="mt-4 !text-[clamp(1.8rem,9vw,2.5rem)] font-extrabold !leading-tight text-white sm:!text-5xl" style={textFill}>
              {page.processSection.title} <span style={{ color: accent }}>{page.processSection.highlight}</span> {page.processSection.suffix}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm font-medium leading-7 text-white/70">
              {page.processSection.description}
            </p>
          </div>
          <div className={`relative grid min-w-0 gap-5 sm:gap-6 md:grid-cols-2 ${processColumnClass}`}>
            <span className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-16 hidden h-px bg-gradient-to-r from-transparent via-[#ff3f51]/55 to-transparent xl:block" />
            {page.processSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.06, duration: 0.45 }}
                className="group relative min-w-0 overflow-hidden rounded-lg border border-white/14 bg-transparent p-5 shadow-[0_18px_55px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-1 hover:border-[#ff3f51]/45 sm:p-6 sm:shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
              >
                <span className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl transition" style={{ backgroundColor: `${accent}24` }} />
                <span className="pointer-events-none absolute inset-x-0 top-0 h-1 opacity-75" style={{ background: `linear-gradient(90deg, ${accent}, #ff7a59, #6f63ff)` }} />
                <div className="relative z-10 mb-7 flex items-center justify-between">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-[#071124]/55 shadow-[0_18px_45px_rgba(255,63,81,0.14)] transition group-hover:scale-105 group-hover:text-white sm:h-20 sm:w-20" style={{ color: accent }}>
                    <IconSlot item={step} size={32} imageClassName="p-4" />
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border text-xs font-extrabold text-white shadow-[0_12px_34px_rgba(255,63,81,0.24)]" style={{ borderColor: `${accent}59`, backgroundColor: `${accent}29` }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-extrabold text-white sm:text-2xl" style={textFill}>{step.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-7 text-white/72 sm:min-h-[84px]">{step.text}</p>
                  <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <span
                      className="block h-full rounded-full shadow-[0_0_22px_rgba(255,63,81,0.55)]"
                      style={{ width: `${((index + 1) / page.processSteps.length) * 100}%`, backgroundColor: accent }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="relative overflow-hidden py-12 sm:py-24"
        style={{ backgroundImage: `url(${page.backgrounds.whyChoose})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="container relative z-10 mx-auto grid max-w-full items-center gap-8 px-4 sm:gap-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="relative min-w-0">
            <p className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.2em] sm:text-[12px] sm:tracking-[0.28em]" style={{ color: accent }}>
              {page.whyChoose.eyebrow}
            </p>
            <h2 className="!text-[clamp(1.8rem,9vw,2.5rem)] font-extrabold !leading-tight text-[#071124] sm:!text-5xl" style={textFill}>
              {page.whyChoose.title} <span style={{ color: accent }}>{page.whyChoose.highlight}</span>
            </h2>
            <p className="mt-4 max-w-lg text-sm font-medium leading-7 text-[#536176] sm:mt-5 sm:text-base sm:leading-8">
              {page.whyChoose.description}
            </p>
            <div className="mt-7 grid max-w-xl grid-cols-2 overflow-hidden rounded-lg border border-white/80 bg-white/75 shadow-[0_18px_55px_rgba(7,17,36,0.1)] backdrop-blur sm:mt-9 sm:grid-cols-4 sm:shadow-[0_24px_80px_rgba(7,17,36,0.1)]">
              {page.whyChoose.stats.map(([value, label]) => (
                <div key={label} className="min-w-0 border-r border-b border-[#edf0f6] px-2 py-4 text-center even:border-r-0 last:border-r-0 sm:border-b-0 sm:even:border-r sm:last:border-r-0 sm:px-4 sm:py-5">
                  <AnimatedNumber
                    value={value}
                    as="p"
                    className="text-xl font-extrabold sm:text-3xl"
                    style={{ ...textFill, color: accent }}
                  />
                  <p className="mt-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#667085] sm:text-[11px] sm:tracking-[0.14em]">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid min-w-0 gap-4 sm:grid-cols-2 sm:gap-5">
            {page.reasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="group relative min-h-[112px] min-w-0 overflow-hidden rounded-lg border border-white/85 bg-white/86 p-4 shadow-[0_18px_55px_rgba(7,17,36,0.09)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_30px_95px_rgba(7,17,36,0.16)] sm:min-h-[118px] sm:shadow-[0_22px_75px_rgba(7,17,36,0.1)]"
              >
                <span className="absolute inset-x-0 top-0 h-1 opacity-0 transition group-hover:opacity-100" style={{ background: `linear-gradient(90deg, ${accent}, #6f63ff)` }} />
                <span className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl transition" style={{ backgroundColor: `${accent}1a` }} />
                <div className="relative z-10 flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#ffe0e4] bg-[linear-gradient(145deg,#ffffff,#fff3f5)] shadow-[0_12px_28px_rgba(255,63,81,0.12)] transition group-hover:scale-105" style={{ color: accent }}>
                    <IconSlot item={reason} size={20} imageClassName="p-2" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-extrabold leading-tight text-[#071124]" style={textFill}>{reason.title}</h3>
                    <p className="mt-1.5 text-sm font-medium leading-5 text-[#667085]">{reason.text}</p>
                  </div>
                </div>
                <div className="relative z-10 mt-3 border-t border-[#eef1f7] pt-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#98a2b3]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {page.impactSection && (
        <section
          className="relative overflow-hidden bg-[#06111f] py-20 text-white sm:py-24"
          style={{ backgroundImage: `url(${page.backgrounds.impact || page.backgrounds.process})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <span className="absolute inset-0 bg-[#06111f]/42" />
          <div className="container relative z-10 mx-auto grid max-w-full gap-8 px-4 sm:gap-10 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div className="min-w-0">
              <SectionBadge light>{page.impactSection.badge}</SectionBadge>
              <h2 className="mt-5 !text-[clamp(1.8rem,9vw,2.5rem)] font-extrabold !leading-tight text-white sm:!text-5xl" style={textFill}>
                {page.impactSection.title} <span style={{ color: accent }}>{page.impactSection.highlight}</span>
              </h2>
              <p className="mt-4 max-w-lg text-sm font-medium leading-7 text-white/72">
                {page.impactSection.description}
              </p>
              <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:mt-9 sm:grid-cols-4 sm:gap-4">
                {page.impactSection.stats.map(([value, label, Icon]) => (
                  <div key={label} className="min-w-0 rounded-lg border border-white/12 bg-white/[0.045] p-4">
                    {Icon && <Icon className="mb-4" size={24} style={{ color: accent }} />}
                    <AnimatedNumber
                      value={value}
                      as="p"
                      className="text-3xl font-extrabold text-white"
                    />
                    <p className="mt-1 text-[11px] font-bold leading-5 text-white/70">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid min-w-0 gap-5 md:grid-cols-3">
              {page.impactSection.cases.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => navigate(item.route)}
                  className="group min-w-0 overflow-hidden rounded-lg border border-white/14 bg-white/[0.06] text-left shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.09] sm:shadow-[0_26px_80px_rgba(0,0,0,0.22)]"
                >
                  <img decoding="async" loading="lazy" src={item.image} alt={item.title} className="h-40 w-full object-cover" />
                  <span className="block p-5">
                    <span className="block text-lg font-extrabold text-white">{item.title}</span>
                    <span className="mt-3 block text-sm font-medium leading-6 text-white/70">{item.text}</span>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold" style={{ color: accent }}>
                      View Case Study <ArrowRight size={15} />
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section
          className="relative overflow-hidden bg-[#06111f] py-12 text-white sm:py-20"
          style={{ backgroundImage: `url(${page.backgrounds.testimonials})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="container relative z-10 mx-auto max-w-full px-4 sm:px-6">
            <div className="mb-10 text-center">
              <SectionBadge light>{page.testimonialsSection.badge}</SectionBadge>
              <h2 className="mt-4 !text-[clamp(1.8rem,9vw,2.5rem)] font-extrabold !leading-tight text-white sm:!text-5xl" style={textFill}>
                {page.testimonialsSection.title} <span style={{ color: accent }}>{page.testimonialsSection.highlight}</span> {page.testimonialsSection.suffix}
              </h2>
            </div>
          </div>
          <div className="testimonial-marquee-row relative left-1/2 z-10 w-screen -translate-x-1/2 px-4 pb-8 pt-2">
            <div className="testimonial-marquee-track">
              {loopTestimonials.map((item, index) => (
                <figure
                  key={`${item.name}-${index}`}
                  className="relative flex h-[260px] w-[calc(100vw-2rem)] max-w-[360px] shrink-0 flex-col rounded-lg border border-white/10 bg-white/[0.075] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.2)] backdrop-blur transition hover:-translate-y-1 sm:h-[250px] sm:w-[430px] sm:max-w-none sm:p-6 sm:shadow-[0_22px_70px_rgba(0,0,0,0.22)]"
                >
                  <div className="mb-4 text-4xl font-extrabold leading-none" style={{ color: accent }}>"</div>
                  <blockquote className="flex-1 text-sm font-medium leading-7 text-white/82">{item.body}</blockquote>
                  <figcaption className="mt-5 flex items-center justify-between gap-4">
                    <span>
                      <span className="block text-sm font-extrabold text-white">{item.name}</span>
                      <span className="block text-xs font-medium text-white/55">{item.role}</span>
                    </span>
                    <span className="flex text-[#ffc64b]">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star key={starIndex} size={14} fill="currentColor" />
                      ))}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-[#06111f] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-[#06111f] to-transparent" />
          </div>
        </section>
      )}

      <section
        className="relative overflow-hidden border-y border-white/10 bg-[#06111f] py-12 text-white sm:py-16"
      >
        <picture>
          {page.backgrounds.ctaMobile && (
            <source media="(max-width: 640px)" srcSet={page.backgrounds.ctaMobile} />
          )}
          <img
            src={page.backgrounds.cta}
            alt="Vibha Art Services - Graphic Design and Printing"
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="lazy"
            aria-hidden="true"
          />
        </picture>
        <div
          className={`container relative z-10 mx-auto flex max-w-full flex-col gap-7 px-4 sm:gap-8 sm:px-6 ${
            ctaAlign === "center"
              ? "items-center text-center"
              : ctaAlign === "mobileCenter"
              ? "items-center justify-between text-center lg:flex-row lg:items-center lg:text-left"
              : "items-start justify-between lg:flex-row lg:items-center"
          }`}
        >
          <div className={ctaAlign === "center" ? "flex min-w-0 flex-col items-center" : ctaAlign === "mobileCenter" ? "flex min-w-0 flex-col items-center lg:items-start" : "min-w-0"}>
            <h2
              className={`max-w-xl !text-[clamp(1.85rem,9vw,2.5rem)] font-extrabold !leading-tight drop-shadow-[0_8px_22px_rgba(255,255,255,0.24)] sm:!text-5xl ${ctaTextTone === "dark" ? "text-[#071124]" : "text-white"}`}
              style={textFill}
            >
              {page.cta.title} <span style={{ color: accent }}>{page.cta.highlight}</span>
            </h2>
            <p className={`mt-4 max-w-lg text-sm font-semibold leading-7 ${ctaTextTone === "dark" ? "text-[#263447]" : "text-white/72"}`}>
              {page.cta.description}
            </p>
          </div>
          <div className={`flex w-full min-w-0 flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4 ${ctaAlign === "center" || ctaAlign === "mobileCenter" ? "justify-center" : ""}`}>
            <button
              onClick={() => navigate(page.cta.primary.route)}
              className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_18px_45px_rgba(255,63,81,0.34)] transition hover:-translate-y-1 sm:w-auto sm:px-8 sm:py-4"
              style={{ backgroundColor: accent }}
            >
              {page.cta.primary.label} <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate(page.cta.secondary.route)}
              className={`inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full border px-6 py-3.5 text-sm font-extrabold shadow-[0_18px_45px_rgba(0,0,0,0.14)] backdrop-blur transition hover:-translate-y-1 sm:w-auto sm:px-8 sm:py-4 ${
                ctaTextTone === "dark"
                  ? "border-[#071124]/25 bg-white/75 text-[#071124] hover:bg-white"
                  : "border-white/25 bg-white/5 text-white hover:bg-white/12"
              }`}
            >
              {page.cta.secondary.label} <Target size={17} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceLandingTemplate;
