import React, { useCallback, useEffect, useRef, useState } from "react";

import heroImage from "../assets/Corporate/1695210509.jpg";
import sideLeft1 from "../assets/Logo/Logo_1.jpg";
import sideLeft2 from "../assets/Logo/Logo_2.jpg";
import sideRight1 from "../assets/Logo/Logo_3.jpg";
import sideRight2 from "../assets/Logo/Logo_4.jpg";

import profileOne from "../assets/Visiting Card/Visi_1.jpg";
import profileTwo from "../assets/Brouchers/3593222.jpg";

import featureBranding from "../assets/Corporate/3-3.jpg";
import featurePackaging from "../assets/Packeging/Almond Oil Packege.jpg";
import featurePrint from "../assets/Pamphlet/1984.jpg";
import featureSocial from "../assets/Packeging/Behance Ad 1.jpg";
import featureIdentity from "../assets/Corporate/3-4.jpg";
import featureCard from "../assets/Visiting Card/Visi_2.jpg";

import galleryOne from "../assets/Logo/Logo_5.jpg";
import galleryTwo from "../assets/Logo/Logo_6.jpg";
import galleryThree from "../assets/Logo/Logo_7.jpg";
import galleryFour from "../assets/Logo/Logo_8.jpg";
import galleryFive from "../assets/Logo/Logo_10.jpg";
import gallerySix from "../assets/Logo/Logo_11.jpg";

import workflowOne from "../assets/Brouchers/17947819.jpg";
import workflowTwo from "../assets/Brouchers/3327941.jpg";

function FadeImage({ src, alt, className = "", style = {}, fadeDelay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), fadeDelay);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [fadeDelay]);

  return (
    <div ref={ref} className="relative h-full w-full" style={style}>
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`${className} transition-all duration-700 ease-out ${
          isVisible && isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]"
        }`}
      />
    </div>
  );
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isMobile;
}

function HeroSection() {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollableHeight = window.innerHeight * 2;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textOpacity = Math.max(0, 1 - scrollProgress / 0.2);
  const imageProgress = Math.max(0, Math.min(1, (scrollProgress - 0.2) / 0.8));
  const centerWidth = 100 - imageProgress * 58;
  const centerHeight = 100 - imageProgress * 30;
  const sideWidth = imageProgress * 22;
  const sideOpacity = imageProgress;
  const sideTranslateLeft = -100 + imageProgress * 100;
  const sideTranslateRight = 100 - imageProgress * 100;
  const borderRadius = imageProgress * 24;
  const gap = imageProgress * 16;
  const sideTranslateY = -(imageProgress * 15);

  const sideImages = [
    { src: sideLeft1, position: "left", alt: "Logo project one" },
    { src: sideLeft2, position: "left", alt: "Logo project two" },
    { src: sideRight1, position: "right", alt: "Logo project three" },
    { src: sideRight2, position: "right", alt: "Logo project four" },
  ];

  if (isMobile) {
    return (
      <section className="bg-background">
        <div className="px-4 pb-12 pt-28">
          <div className="relative overflow-hidden rounded-2xl">
            <FadeImage src={heroImage} alt="Vibha Art Featured Work" className="h-[65vh] w-full object-cover" />
            <div className="absolute inset-0 bg-black/35" />
            <h1 className="absolute inset-0 flex items-end justify-center pb-8 text-center text-5xl font-semibold tracking-[0.2em] text-white">
              {"ABOUT".split("").map((letter, index) => (
                <span
                  key={`${letter}-${index}`}
                  className="inline-block animate-[slideUp_0.7s_ease-out_forwards] opacity-0"
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  {letter}
                </span>
              ))}
            </h1>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {sideImages.map((img, index) => (
              <div key={img.alt} className="relative aspect-[4/5] overflow-hidden rounded-xl">
                <FadeImage src={img.src} alt={img.alt} className="h-full w-full object-cover" fadeDelay={index * 90} />
              </div>
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-3xl animate-[slideUp_0.8s_ease-out_0.25s_forwards] text-center text-base leading-relaxed text-muted-foreground opacity-0">
            Strategic graphic design, premium printing, and brand visuals that help businesses grow.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative bg-background">
      <div className="sticky top-[6.5rem] h-[calc(100vh-6.5rem)] overflow-hidden">
        <div className="flex h-full w-full items-center justify-center">
          <div
            className="relative flex h-full w-full items-stretch justify-center"
            style={{ gap: `${gap}px`, padding: `${imageProgress * 16}px`, paddingBottom: `${60 + imageProgress * 40}px` }}
          >
            <div
              className="flex flex-col will-change-transform"
              style={{
                width: `${sideWidth}%`,
                gap: `${gap}px`,
                transform: `translateX(${sideTranslateLeft}%) translateY(${sideTranslateY}%)`,
                opacity: sideOpacity,
              }}
            >
              {sideImages
                .filter((i) => i.position === "left")
                .map((img) => (
                  <div key={img.alt} className="relative flex-1 overflow-hidden" style={{ borderRadius: `${borderRadius}px` }}>
                    <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
                  </div>
                ))}
            </div>

            <div
              className="relative overflow-hidden"
              style={{ width: `${centerWidth}%`, height: `${centerHeight}%`, flex: "0 0 auto", borderRadius: `${borderRadius}px` }}
            >
              <img src={heroImage} alt="Vibha Art Featured Work" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/25" />
              <div className="absolute inset-0 flex items-end overflow-hidden" style={{ opacity: textOpacity }}>
                <h1 className="w-full text-center text-[18vw] font-medium leading-[0.8] tracking-[0.25em] text-white md:text-[14vw]">
                  {"ABOUT".split("").map((letter, index) => (
                    <span
                      key={`${letter}-${index}`}
                      className="inline-block animate-[slideUp_0.8s_ease-out_forwards] opacity-0"
                      style={{ animationDelay: `${index * 0.06}s` }}
                    >
                      {letter}
                    </span>
                  ))}
                </h1>
              </div>
            </div>

            <div
              className="flex flex-col will-change-transform"
              style={{
                width: `${sideWidth}%`,
                gap: `${gap}px`,
                transform: `translateX(${sideTranslateRight}%) translateY(${sideTranslateY}%)`,
                opacity: sideOpacity,
              }}
            >
              {sideImages
                .filter((i) => i.position === "right")
                .map((img) => (
                  <div key={img.alt} className="relative flex-1 overflow-hidden" style={{ borderRadius: `${borderRadius}px` }}>
                    <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-[200vh]" />

      <div className="px-6 pb-24 pt-28 md:px-12 md:pb-32 md:pt-44 lg:px-20 lg:pb-40 lg:pt-52">
        <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-muted-foreground md:text-xl lg:text-2xl lg:leading-snug">
          Strategic graphic design, premium printing,
          <br />
          and brand visuals that help businesses grow.
        </p>
      </div>
    </section>
  );
}

function PhilosophySection() {
  const sectionRef = useRef(null);
  const [leftTranslateX, setLeftTranslateX] = useState(-100);
  const [rightTranslateX, setRightTranslateX] = useState(100);
  const [titleOpacity, setTitleOpacity] = useState(1);
  const rafRef = useRef(null);
  const isMobile = useIsMobile();

  const updateTransforms = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionHeight = sectionRef.current.offsetHeight;
    const scrollableRange = sectionHeight - windowHeight;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / scrollableRange));

    setLeftTranslateX((1 - progress) * -100);
    setRightTranslateX((1 - progress) * 100);
    setTitleOpacity(1 - progress);
  }, []);

  useEffect(() => {
    if (isMobile) return undefined;

    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateTransforms);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateTransforms();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile, updateTransforms]);

  if (isMobile) {
    return (
      <section id="products" className="bg-background px-4 py-14">
        <h2 className="animate-[slideUp_0.8s_ease-out_forwards] text-center text-3xl font-medium leading-tight text-foreground opacity-0">
          Graphic Design & Printing
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <FadeImage src={profileOne} alt="Graphic Design Services" className="h-full w-full object-cover" />
            <div className="absolute bottom-4 left-4">
              <span className="rounded-full bg-black/35 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                Branding + Graphic Design
              </span>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <FadeImage src={profileTwo} alt="Printing Services" className="h-full w-full object-cover" fadeDelay={120} />
            <div className="absolute bottom-4 left-4">
              <span className="rounded-full bg-black/35 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                Offset + Digital Printing
              </span>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-5xl animate-[slideUp_0.8s_ease-out_0.15s_forwards] text-center text-lg leading-relaxed text-muted-foreground opacity-0">
          Vibha Art helps businesses build strong brand identity through logo design, social media creatives, packaging design, and high-quality printing solutions. We combine creative thinking with practical production experience.
        </p>
      </section>
    );
  }

  return (
    <section id="products" className="bg-background">
      <div ref={sectionRef} className="relative" style={{ height: "170vh" }}>
        <div className="sticky top-[6.5rem] flex h-[calc(100vh-6.5rem)] items-center justify-center">
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center" style={{ opacity: titleOpacity }}>
              <h2 className="px-6 text-center text-[11vw] font-medium leading-[0.95] tracking-tighter text-foreground md:text-[8vw]">
                Graphic Design & Printing
              </h2>
            </div>

            <div className="relative z-10 grid grid-cols-1 gap-4 px-6 md:grid-cols-2 md:px-12 lg:px-20">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl" style={{ transform: `translate3d(${leftTranslateX}%, 0, 0)` }}>
                <img src={profileOne} alt="Graphic Design Services" className="h-full w-full object-cover" />
                <div className="absolute bottom-6 left-6">
                  <span className="rounded-full bg-black/35 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                    Branding + Graphic Design
                  </span>
                </div>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl" style={{ transform: `translate3d(${rightTranslateX}%, 0, 0)` }}>
                <img src={profileTwo} alt="Printing Services" className="h-full w-full object-cover" />
                <div className="absolute bottom-6 left-6">
                  <span className="rounded-full bg-black/35 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                    Offset + Digital Printing
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-32">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">About Vibha Art</p>
          <p className="mx-auto mt-8 max-w-5xl text-2xl leading-relaxed text-muted-foreground md:text-3xl">
            Vibha Art helps businesses build strong brand identity through logo design,
            social media creatives, packaging design, and high-quality printing solutions.
            We combine creative thinking with practical production experience.
          </p>
        </div>
      </div>
    </section>
  );
}

function FeaturedProductsSection() {
  const features = [
    { title: "Brand Identity Systems", description: "Graphics", image: featureBranding },
    { title: "Product Packaging Design", description: "Packaging", image: featurePackaging },
    { title: "Pamphlet & Poster Printing", description: "Printing", image: featurePrint },
    { title: "Social Media Creatives", description: "Digital", image: featureSocial },
    { title: "Corporate Stationery", description: "Corporate", image: featureIdentity },
    { title: "Business Card Design", description: "Visiting Card", image: featureCard },
  ];

  return (
    <section id="technology" className="bg-background">
      <div className="px-6 pb-16 pt-20 text-center md:px-12 md:pt-28 lg:px-20 lg:pt-32">
        <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
          Services We Deliver
          <br />
          For Design + Printing Needs
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-sm text-muted-foreground md:text-base">
          End-to-end support from concept design to final printed output.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 px-6 pb-20 md:grid-cols-3 md:px-12 lg:px-20">
        {features.map((feature) => (
          <div key={feature.title} className="group">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <FadeImage src={feature.image} alt={feature.title} className="h-full w-full object-cover group-hover:scale-105" />
            </div>
            <div className="py-6">
              <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">{feature.description}</p>
              <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ScrollRevealText({ text }) {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const startOffset = windowHeight * 0.9;
      const endOffset = windowHeight * 0.1;
      const totalDistance = startOffset - endOffset;
      const currentPosition = startOffset - rect.top;
      setProgress(Math.max(0, Math.min(1, currentPosition / totalDistance)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const words = text.split(" ");
  return (
    <p ref={containerRef} className="text-3xl font-semibold leading-snug md:text-4xl lg:text-5xl">
      {words.map((word, index) => {
        const wordProgress = index / words.length;
        const isRevealed = progress > wordProgress;
        return (
          <span key={`${word}-${index}`} className="transition-colors duration-150" style={{ color: isRevealed ? "var(--foreground)" : "#e4e4e7" }}>
            {word}
            {index < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </p>
  );
}

function TechnologySection() {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return undefined;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollableHeight = window.innerHeight * 2;
      const scrolled = -rect.top;
      setScrollProgress(Math.max(0, Math.min(1, scrolled / scrollableHeight)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  const imageProgress = Math.max(0, Math.min(1, (scrollProgress - 0.2) / 0.8));
  const sideWidth = imageProgress * 22;
  const sideOpacity = imageProgress;
  const sideTranslateLeft = -100 + imageProgress * 100;
  const sideTranslateRight = 100 - imageProgress * 100;
  const borderRadius = imageProgress * 24;
  const gap = imageProgress * 16;
  const centerWidth = 100 - imageProgress * 58;

  const localSideImages = [
    { src: galleryOne, position: "left", alt: "Design sample one" },
    { src: galleryTwo, position: "left", alt: "Design sample two" },
    { src: galleryThree, position: "right", alt: "Design sample three" },
    { src: galleryFour, position: "right", alt: "Design sample four" },
  ];

  if (isMobile) {
    return (
      <section className="bg-foreground text-white">
        <div className="px-4 pb-14 pt-14">
          <div className="relative overflow-hidden rounded-2xl">
            <FadeImage src={workflowOne} alt="Printing workflow" className="h-[52vh] w-full object-cover" />
            <div className="absolute inset-0 bg-black/35" />
            <h2 className="absolute inset-0 flex items-center justify-center px-6 text-center text-3xl font-medium leading-tight">
              Printing Meets Creative Graphics
            </h2>
          </div>
          <p className="mt-8 animate-[slideUp_0.8s_ease-out_0.15s_forwards] text-base leading-relaxed text-white/90 opacity-0">
            From logo and social media design to brochure, business card, packaging and corporate printing, Vibha Art offers complete visual communication support. We ensure your brand looks consistent, professional and memorable across digital and print touchpoints.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative bg-foreground">
      <div className="sticky top-[6.5rem] h-[calc(100vh-6.5rem)] overflow-hidden">
        <div className="flex h-full w-full items-center justify-center">
          <div className="relative flex h-full w-full items-stretch justify-center" style={{ gap: `${gap}px`, padding: `${imageProgress * 16}px` }}>
            <div className="flex flex-col" style={{ width: `${sideWidth}%`, gap: `${gap}px`, transform: `translateX(${sideTranslateLeft}%)`, opacity: sideOpacity }}>
              {localSideImages.filter((i) => i.position === "left").map((img) => (
                <div key={img.alt} className="relative flex-1 overflow-hidden" style={{ borderRadius: `${borderRadius}px` }}>
                  <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>

            <div className="relative overflow-hidden" style={{ width: `${centerWidth}%`, height: "100%", flex: "0 0 auto", borderRadius: `${borderRadius}px` }}>
              <img src={workflowOne} alt="Printing workflow" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-foreground/45" />
              <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                <h2 className="max-w-4xl rounded-2xl bg-black/30 px-6 py-4 text-4xl font-medium leading-tight tracking-tight text-white backdrop-blur-md md:px-10 md:py-6 md:text-6xl">
                  Printing Meets Creative Graphics
                </h2>
              </div>
            </div>

            <div className="flex flex-col" style={{ width: `${sideWidth}%`, gap: `${gap}px`, transform: `translateX(${sideTranslateRight}%)`, opacity: sideOpacity }}>
              {localSideImages.filter((i) => i.position === "right").map((img) => (
                <div key={img.alt} className="relative flex-1 overflow-hidden" style={{ borderRadius: `${borderRadius}px` }}>
                  <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-[160vh]" />

      <div className="relative overflow-hidden bg-background px-6 py-24 md:px-12 md:py-32 lg:px-20 lg:py-40">
        <div className="relative z-10 mx-auto max-w-5xl">
          <ScrollRevealText text="From logo and social media design to brochure, business card, packaging and corporate printing, Vibha Art offers complete visual communication support. We ensure your brand looks consistent, professional and memorable across digital and print touchpoints." />
        </div>
      </div>
    </section>
  );
}

function GallerySection() {
  const galleryRef = useRef(null);
  const containerRef = useRef(null);
  const [sectionHeight, setSectionHeight] = useState("100vh");
  const [translateX, setTranslateX] = useState(0);
  const rafRef = useRef(null);
  const isMobile = useIsMobile();

  const images = [galleryOne, galleryTwo, galleryThree, galleryFour, galleryFive, gallerySix, workflowOne, workflowTwo];

  useEffect(() => {
    if (isMobile) {
      setSectionHeight("auto");
      return undefined;
    }

    const calculateHeight = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      setSectionHeight(`${viewportHeight + (containerWidth - viewportWidth)}px`);
    };

    const timer = setTimeout(calculateHeight, 100);
    window.addEventListener("resize", calculateHeight);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculateHeight);
    };
  }, [isMobile]);

  const updateTransform = useCallback(() => {
    if (!galleryRef.current || !containerRef.current) return;
    const rect = galleryRef.current.getBoundingClientRect();
    const containerWidth = containerRef.current.scrollWidth;
    const viewportWidth = window.innerWidth;
    const totalScrollDistance = containerWidth - viewportWidth;
    const scrolled = Math.max(0, -rect.top);
    const progress = Math.min(1, scrolled / totalScrollDistance);
    setTranslateX(progress * -totalScrollDistance);
  }, []);

  useEffect(() => {
    if (isMobile) return undefined;

    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateTransform);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateTransform();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile, updateTransform]);

  if (isMobile) {
    return (
      <section id="gallery" className="bg-background px-4 py-14">
        <h2 className="mb-6 animate-[slideUp_0.8s_ease-out_forwards] text-2xl font-semibold text-foreground opacity-0">Recent Work Gallery</h2>
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
          {images.map((src, index) => (
            <div key={`${src}-${index}`} className="relative h-[52vh] w-[82vw] flex-shrink-0 snap-center overflow-hidden rounded-2xl">
              <FadeImage
                src={src}
                alt={`Portfolio ${index + 1}`}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                fadeDelay={index * 70}
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" ref={galleryRef} className="relative bg-background" style={{ height: sectionHeight }}>
      <div className="sticky top-[6.5rem] h-[calc(100vh-6.5rem)] overflow-hidden">
        <div className="flex h-full items-center">
          <div ref={containerRef} className="flex gap-6 px-6" style={{ transform: `translate3d(${translateX}px, 0, 0)` }}>
            {images.map((src, index) => (
              <div key={`${src}-${index}`} className="relative h-[70vh] w-[85vw] flex-shrink-0 overflow-hidden rounded-2xl md:w-[60vw] lg:w-[45vw]">
                <img src={src} alt={`Portfolio ${index + 1}`} className="h-full w-full object-cover" loading={index < 3 ? "eager" : "lazy"} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function EditorialSection() {
  const stats = [
    { label: "Years Experience", value: "10+" },
    { label: "Projects Delivered", value: "500+" },
    { label: "Design Categories", value: "20+" },
    { label: "Client Retention", value: "90%" },
  ];

  return (
    <section className="bg-background">
      <div className="grid grid-cols-2 border-t border-border md:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="border-b border-r border-border p-8 text-center last:border-r-0 md:border-b-0">
            <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">{item.label}</p>
            <p className="text-4xl font-medium text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="relative aspect-[16/9] w-full md:aspect-[21/9]">
        <img src={workflowTwo} alt="Printing and design showcase" className="absolute inset-0 h-full w-full object-cover" />
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section id="about" className="bg-background">
      <div className="px-6 py-24 md:px-12 md:py-32 lg:px-20 lg:py-40">
        <p className="mx-auto max-w-5xl text-2xl leading-relaxed text-foreground md:text-3xl lg:text-[2.5rem] lg:leading-snug">
          We are not just a design studio. We are your execution partner for branding,
          graphics, and printing. Our goal is to make your business look trustworthy,
          premium, and market-ready at every touchpoint.
        </p>
      </div>

      <div className="relative aspect-[16/9] w-full">
        <img src={heroImage} alt="Vibha Art Showcase" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>
    </section>
  );
}

const EnhancedAbout = () => {
  return (
    <main className="min-h-screen bg-background pt-[6.5rem]">
      <HeroSection />
      <PhilosophySection />
      <FeaturedProductsSection />
      <TechnologySection />
      <GallerySection />
      <EditorialSection />
      <TestimonialsSection />
    </main>
  );
};

export default EnhancedAbout;
