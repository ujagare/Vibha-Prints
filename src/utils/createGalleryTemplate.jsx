import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ArrowUpRight, ChevronLeft, ChevronRight, Eye, X } from "lucide-react";

export const createGalleryTemplate = (config) => {
  const {
    title,
    description,
    items,
    category = "Design",
    answerSection,
    faqItems = [],
  } = config;

  const GalleryComponent = () => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [slideDirection, setSlideDirection] = useState(0);

    const openLightbox = (index) => {
      setCurrentImageIndex(index);
      setLightboxOpen(true);
      document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
      setLightboxOpen(false);
      document.body.style.overflow = "auto";
    };

    const nextImage = () => {
      setSlideDirection(1);
      setCurrentImageIndex((prev) =>
        prev === items.length - 1 ? 0 : prev + 1,
      );
    };

    const prevImage = () => {
      setSlideDirection(-1);
      setCurrentImageIndex((prev) =>
        prev === 0 ? items.length - 1 : prev - 1,
      );
    };

    React.useEffect(() => {
      if (!lightboxOpen) return undefined;

      const handleKeyDown = (e) => {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [lightboxOpen, currentImageIndex]);

    return (
      <div className="min-h-screen w-full overflow-hidden bg-[#f6f8fb] font-['Poppins'] text-[#071124]">
        {faqItems.length > 0 && (
          <Helmet>
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqItems.map((item) => ({
                  "@type": "Question",
                  name: item.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: item.answer,
                  },
                })),
              })}
            </script>
          </Helmet>
        )}
        <section className="relative overflow-hidden border-b border-[#dde4ef] bg-[#071124] px-4 py-14 text-white sm:px-6 sm:py-16">
          <div className="absolute inset-0 opacity-[0.18]">
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "42px 42px",
              }}
            />
          </div>
          <div className="container relative z-10 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mx-auto max-w-4xl text-center"
            >
              <h1 className="text-[34px] font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-white/72 sm:text-base">
                {description}
              </p>
            </motion.div>
          </div>
        </section>

        {answerSection && (
          <section className="border-b border-[#e4ebf5] bg-white px-4 py-10 sm:px-6 sm:py-12">
            <div className="container mx-auto">
              <article className="mx-auto max-w-4xl rounded-lg border border-[#e6ebf3] bg-[#f8fafc] p-5 shadow-[0_20px_60px_rgba(7,17,36,0.08)] sm:p-8">
                <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#d13339]">
                  {answerSection.eyebrow}
                </p>
                <h2 className="text-2xl font-extrabold leading-tight text-[#071124] sm:text-3xl">
                  {answerSection.question}
                </h2>
                <p className="mt-4 text-base font-semibold leading-8 text-[#344054]">
                  {answerSection.answer}
                </p>
                {answerSection.points?.length > 0 && (
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {answerSection.points.map((point) => (
                      <li
                        key={point}
                        className="rounded-md border border-[#edf0f6] bg-white px-4 py-3 text-sm font-semibold leading-6 text-[#536176]"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </div>
          </section>
        )}

        <section className="relative px-4 py-12 sm:px-6 sm:py-16">
          <div className="container relative z-10 mx-auto">
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item, index) => (
                <motion.article
                  key={`${item.title}-${index}`}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.45 }}
                  onClick={() => {
                    if (item.link) {
                      window.open(item.link, "_blank", "noopener,noreferrer");
                    }
                  }}
                  onKeyDown={(e) => {
                    if (item.link && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      window.open(item.link, "_blank", "noopener,noreferrer");
                    }
                  }}
                  role={item.link ? "link" : undefined}
                  tabIndex={item.link ? 0 : undefined}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-lg border border-[#e6ebf3] bg-white shadow-[0_24px_80px_rgba(7,17,36,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#ffd5db] hover:shadow-[0_34px_95px_rgba(7,17,36,0.14)] ${
                    item.link ? "cursor-pointer" : ""
                  }`}
                >
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block w-full overflow-hidden bg-[#edf2f7] text-left cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <div className="w-full overflow-hidden">
                        {item.image ? (
                          <img
                            decoding="async"
                            loading="lazy"
                            src={item.image}
                            alt={item.title}
                            className="h-56 w-full transition duration-500 group-hover:scale-105 object-contain bg-[#f1f5f9]"
                          />
                        ) : (
                          <div className="flex h-56 w-full items-center justify-center bg-[#e9eef5] px-6 text-center text-xl font-extrabold text-[#536176]">
                            {title} {index + 1}
                          </div>
                        )}
                      </div>
                      <span className="absolute inset-0 bg-gradient-to-t from-[#071124]/70 via-[#071124]/10 to-transparent opacity-70 transition group-hover:opacity-90" />
                      <span className="absolute left-4 top-4 rounded-full border border-white/35 bg-white/16 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white shadow-sm backdrop-blur">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#071124] shadow-[0_12px_32px_rgba(0,0,0,0.22)] transition group-hover:bg-[#ff3f51] group-hover:text-white">
                        <ArrowUpRight size={17} />
                      </span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openLightbox(index)}
                      className="relative block w-full overflow-hidden bg-[#edf2f7] text-left"
                    >
                      <div className="w-full overflow-hidden">
                        {item.image ? (
                          <img
                            decoding="async"
                            loading="lazy"
                            src={item.image}
                            alt={item.title}
                            className="h-56 w-full transition duration-500 group-hover:scale-105 object-contain bg-[#f1f5f9]"
                          />
                        ) : (
                          <div className="flex h-56 w-full items-center justify-center bg-[#e9eef5] px-6 text-center text-xl font-extrabold text-[#536176]">
                            {title} {index + 1}
                          </div>
                        )}
                      </div>
                      <span className="absolute inset-0 bg-gradient-to-t from-[#071124]/70 via-[#071124]/10 to-transparent opacity-70 transition group-hover:opacity-90" />
                      <span className="absolute left-4 top-4 rounded-full border border-white/35 bg-white/16 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white shadow-sm backdrop-blur">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#071124] shadow-[0_12px_32px_rgba(0,0,0,0.22)] transition group-hover:bg-[#ff3f51] group-hover:text-white">
                        <Eye size={17} />
                      </span>
                    </button>
                  )}

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    {item.tagline && (
                      <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#ff3f51]">
                        {item.tagline}
                      </p>
                    )}
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <h3 className="min-w-0 text-xl font-extrabold leading-tight text-[#071124] transition group-hover:text-[#ff3f51]">
                        {item.title}
                      </h3>
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#edf0f6] bg-[#f8fafc] text-[#071124] transition hover:border-[#ffb7c0] hover:bg-[#ff3f51] hover:text-white"
                          aria-label={`Visit ${item.title}`}
                        >
                          <ArrowUpRight size={17} />
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openLightbox(index)}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#edf0f6] bg-[#f8fafc] text-[#071124] transition hover:border-[#ffb7c0] hover:bg-[#ff3f51] hover:text-white"
                          aria-label={`Open ${item.title}`}
                        >
                          <ArrowUpRight size={17} />
                        </button>
                      )}
                    </div>
                    <p className="min-h-[54px] flex-1 text-sm font-medium leading-7 text-[#667085]">
                      {item.description}
                    </p>
                    <div className="mt-5 flex items-center justify-between border-t border-[#eef1f7] pt-4">
                      <span className="rounded-full bg-[#fff0f2] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#d13339]">
                        {category}
                      </span>
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="inline-flex items-center gap-2 text-sm font-extrabold text-[#071124] transition hover:text-[#ff3f51]"
                        >
                          Visit Site
                          <ArrowUpRight size={15} />
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openLightbox(index)}
                          className="inline-flex items-center gap-2 text-sm font-extrabold text-[#071124] transition hover:text-[#ff3f51]"
                        >
                          View
                          <ArrowUpRight size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <AnimatePresence>
          {lightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#030712]/95 p-4"
              onClick={closeLightbox}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  closeLightbox();
                }}
                className="absolute right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/10 text-white shadow-[0_18px_45px_rgba(0,0,0,0.3)] backdrop-blur transition hover:bg-white hover:text-[#071124]"
                type="button"
                aria-label="Close image preview"
              >
                <X size={20} />
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-white/10 text-white shadow-[0_18px_45px_rgba(0,0,0,0.3)] backdrop-blur transition hover:bg-white hover:text-[#071124]"
                type="button"
                aria-label="Previous image"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-white/10 text-white shadow-[0_18px_45px_rgba(0,0,0,0.3)] backdrop-blur transition hover:bg-white hover:text-[#071124]"
                type="button"
                aria-label="Next image"
              >
                <ChevronRight size={22} />
              </button>

              <div className="flex h-full w-full max-w-6xl flex-col justify-center gap-4 pt-12 sm:pt-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{
                      x:
                        slideDirection > 0
                          ? 220
                          : slideDirection < 0
                            ? -220
                            : 0,
                      opacity: 0,
                      scale: 0.96,
                    }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{
                      x:
                        slideDirection > 0
                          ? -220
                          : slideDirection < 0
                            ? 220
                            : 0,
                      opacity: 0,
                      scale: 0.96,
                    }}
                    transition={{ duration: 0.28 }}
                    className="flex min-h-0 flex-1 items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      decoding="async"
                      loading="lazy"
                      src={items[currentImageIndex]?.image}
                      alt={items[currentImageIndex]?.title}
                      className="max-h-[64vh] w-auto max-w-[86vw] rounded-lg object-contain shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
                    />
                  </motion.div>
                </AnimatePresence>

                <div
                  className="mx-auto w-full max-w-4xl rounded-lg border border-white/12 bg-white/[0.08] p-4 text-white shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#ff8b95]">
                        {currentImageIndex + 1} of {items.length}
                      </p>
                      <h3 className="mt-1 text-xl font-extrabold text-white">
                        {items[currentImageIndex]?.title}
                      </h3>
                      <p className="mt-2 text-sm font-medium leading-6 text-white/70">
                        {items[currentImageIndex]?.description}
                      </p>
                    </div>
                    <span className="w-max rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/78">
                      {category}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                    {items.map((item, index) => (
                      <button
                        key={`${item.title}-thumb-${index}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSlideDirection(index > currentImageIndex ? 1 : -1);
                          setCurrentImageIndex(index);
                        }}
                        className={`h-14 w-16 shrink-0 overflow-hidden rounded-md border transition ${
                          index === currentImageIndex
                            ? "border-[#ff5967] opacity-100"
                            : "border-white/14 opacity-55 hover:opacity-100"
                        }`}
                        type="button"
                        aria-label={`Preview ${item.title}`}
                      >
                        <img
                          decoding="async"
                          loading="lazy"
                          src={item.image}
                          alt="Vibha Art Portfolio - Design & Print Gallery"
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return GalleryComponent;
};
