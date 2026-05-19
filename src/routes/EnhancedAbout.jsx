import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight as FaArrowRight,
  Target as FaBullseye,
  ChartLine as FaChartLine,
  CheckCircle as FaCheckCircle,
  Crown as FaCrown,
  Heart as FaHeart,
  Instagram as FaInstagram,
  Linkedin as FaLinkedinIn,
  Lightbulb as FaLightbulb,
  Medal as FaMedal,
  Palette as FaPalette,
  Rocket as FaRocket,
  Star as FaStar,
  Users as FaUsers,
} from "lucide-react";
import "./EnhancedAbout.css";
import aboutHeroMobile from "../assets/About/Mobile/image-026.webp";
import SEO from "../components/SEO";

gsap.registerPlugin(ScrollTrigger);

const aboutImages = import.meta.glob("../assets/About/*.{png,webp}", {
  eager: true,
  import: "default",
});

const aboutIconImages = import.meta.glob("../assets/About/Icons/*.{png,webp}", {
  eager: true,
  import: "default",
});

const clientLogoModules = import.meta.glob("../assets/png logos/*.{png,webp,svg}", {
  eager: true,
  import: "default",
});

const imageList = Object.entries(aboutImages)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

const heroBg = imageList[2] || imageList[0];
const storyBg = imageList[0] || heroBg;
const teamBg = imageList[1] || storyBg;
const ctaBg = imageList[3] || storyBg;

const iconList = Object.entries(aboutIconImages)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

const storyCards = [
  {
    title: "Our Mission",
    copy: "To empower brands with innovative design and high-quality print solutions that leave a lasting impact.",
    icon: FaBullseye,
  },
  {
    title: "Our Vision",
    copy: "To be a leading creative partner recognized for excellence, innovation and unmatched reliability.",
    icon: FaPalette,
  },
  {
    title: "Our Promise",
    copy: "We are committed to quality, on-time delivery and building long-term relationships with trust.",
    icon: FaHeart,
  },
];

const values = [
  {
    title: "Quality First",
    copy: "We deliver premium print materials that exceed expectations and reflect your brand's excellence.",
    icon: FaMedal,
  },
  {
    title: "Fast Turnaround",
    copy: "Quick delivery without compromising on quality. Your urgent projects are always our priority.",
    icon: FaRocket,
  },
  {
    title: "Creative Excellence",
    copy: "Our creative team brings innovation and originality to every project to make your brand stand out.",
    icon: FaLightbulb,
  },
  {
    title: "Customer Focus",
    copy: "We listen, understand and deliver exactly what your brand needs to succeed in the market.",
    icon: FaUsers,
  },
  {
    title: "Innovation",
    copy: "We stay ahead with the latest technology and trends to provide modern and effective solutions.",
    icon: FaCrown,
  },
];

const journey = [
  {
    year: "2020",
    title: "The Beginning",
    copy: "Started our journey with a small team and big dreams.",
    icon: FaRocket,
  },
  {
    year: "2021",
    title: "Growing Together",
    copy: "Expanded our team and services to serve more businesses.",
    icon: FaUsers,
  },
  {
    year: "2022",
    title: "Building Trust",
    copy: "Delivered 500+ projects and earned client trust.",
    icon: FaMedal,
  },
  {
    year: "2023",
    title: "Going Beyond",
    copy: "Ventured into digital marketing and web development.",
    icon: FaChartLine,
  },
  {
    year: "2024+",
    title: "Future Ready",
    copy: "Continuing to innovate and help brands achieve more.",
    icon: FaStar,
  },
];

const team = [
  {
    name: "Rahul Sharma",
    role: "Founder & CEO",
    copy: "Visionary leader with a passion for quality and customer satisfaction.",
    initials: "RS",
  },
  {
    name: "Neha Verma",
    role: "Creative Director",
    copy: "Creative mind behind stunning designs and brand experiences.",
    initials: "NV",
  },
  {
    name: "Amit Patel",
    role: "Tech Head",
    copy: "Tech expert building fast, responsive and user-friendly digital solutions.",
    initials: "AP",
  },
];

const formatLogoName = (path) =>
  path
    .split("/")
    .pop()
    ?.replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim() ?? "Client logo";

function IconBadge({ icon: Icon, image, className = "" }) {
  return (
    <span className={`about-icon-badge ${className}`}>
      {image ? (
        <img src={image} alt="About Vibha Art - Design Studio Pune" aria-hidden="true" loading="lazy" />
      ) : (
        <Icon />
      )}
    </span>
  );
}

export default function EnhancedAbout() {
  const rootRef = useRef(null);

  const clientLogos = useMemo(
    () =>
      Object.entries(clientLogoModules)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(0, 6)
        .map(([path, src]) => ({
          name: formatLogoName(path),
          src,
        })),
    [],
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-load", {
        y: 28,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
      });

      gsap.utils.toArray(".about-reveal-section").forEach((section) => {
        gsap.from(section.querySelectorAll(".about-reveal"), {
          y: 30,
          opacity: 0,
          duration: 0.72,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
        });
      });
    }, rootRef);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="about-page" ref={rootRef}>
      <SEO page="about" />
      <section className="about-hero-v2">
        <picture>
          <source media="(max-width: 680px)" srcSet={aboutHeroMobile} />
          <img loading="lazy"
            src={heroBg}
            alt="Vibha Prints design, printing, digital marketing and web development showcase"
            className="about-hero-art"
            fetchPriority="high"
          />
        </picture>
        <div className="about-container about-hero-grid">
          <div className="about-hero-copy">
            <span className="about-eyebrow about-load">About Us</span>
            <h1 className="about-load">
              <span className="about-heading-line">We Print. We Design.</span>
              <span className="about-heading-line">We Market. We Build.</span>
              <strong className="about-heading-line">We Elevate Brands.</strong>
            </h1>
            <p className="about-load">
              At Vibha Prints, we combine creativity, technology, and strategy
              <br />
              to deliver 360&deg; solutions that help businesses stand out,
              <br />
              connect, and grow since 2020.
            </p>
            <div className="about-actions about-load">
              <Link to="/contact" className="about-primary-btn">
                Start Your Project <FaArrowRight />
              </Link>
              <Link to="/printing" className="about-secondary-btn">
                Explore Services <FaCheckCircle />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        className="about-story-v2 about-reveal-section"
        style={{ backgroundImage: `url("${storyBg}")` }}
      >
        <div className="about-container">
          <div className="about-story-top">
            <div className="about-story-copy about-reveal">
              <span className="about-eyebrow">Our Story</span>
              <h2>
                Built for businesses
                <br />
                that want their brand
                <br />
                to be <strong>unforgettable.</strong>
              </h2>
              <p>
                We started with a vision to deliver premium print and design
                <br />
                solutions. Today, we are a full-service creative partner
                <br />
                offering printing, design, digital marketing, and web
                <br />
                development - all under one roof.
              </p>
            </div>
            <div className="about-story-cards">
              {storyCards.map((card, index) => (
                <article className="about-story-card about-reveal" key={card.title}>
                  <IconBadge icon={card.icon} image={iconList[index]} />
                  <h3>{card.title}</h3>
                  <p>{card.copy}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="about-values">
            {values.map((item, index) => (
              <article className="about-value about-reveal" key={item.title}>
                <IconBadge icon={item.icon} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-journey about-reveal-section">
        <div className="about-container">
          <div className="about-center-heading about-reveal">
            <span className="about-eyebrow">Our Experience Journey</span>
            <h2>
              From <strong>2020</strong> to Beyond
            </h2>
          </div>
          <div className="about-timeline">
            {journey.map((item, index) => (
              <article className="about-timeline-item about-reveal" key={item.year}>
                <IconBadge
                  icon={item.icon}
                  className={index === 1 || index === 3 ? "is-red" : ""}
                />
                <h3>{item.year}</h3>
                <h4>{item.title}</h4>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="about-team about-reveal-section"
        style={{ backgroundImage: `url("${teamBg}")` }}
      >
        <div className="about-container">
          <div className="about-team-head">
            <div className="about-reveal">
              <span className="about-eyebrow">Our Team</span>
              <h2>
                The Creative Minds
                <br />
                Behind <strong>Vibha Prints.</strong>
              </h2>
            </div>
          </div>
          <div className="about-team-grid">
            {team.map((member) => (
              <article className="about-team-card about-reveal" key={member.name}>
                <div className="about-avatar">{member.initials}</div>
                <div className="about-team-info">
                  <h3>{member.name}</h3>
                  <span>{member.role}</span>
                  <p>{member.copy}</p>
                  <div className="about-socials">
                    <a href="https://www.linkedin.com" aria-label={`${member.name} LinkedIn`}>
                      <FaLinkedinIn />
                    </a>
                    <a href="https://www.instagram.com" aria-label={`${member.name} Instagram`}>
                      <FaInstagram />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {clientLogos.length > 0 && (
        <section className="about-trusted about-reveal-section">
          <div className="about-trusted-grid">
            <div className="about-trusted-title about-reveal">
              <span className="about-eyebrow">Trusted By</span>
              <h2>
                Brands That
                <br />
                <strong>Believe In Us</strong>
              </h2>
            </div>
            <div className="about-logo-row">
              {clientLogos.map((brand) => (
                <div className="about-logo-box about-reveal" key={brand.name}>
                  <img src={brand.src} alt={brand.name} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="about-final-cta about-reveal-section">
        <div
          className="about-cta-panel about-reveal"
          style={{ backgroundImage: `url("${ctaBg}")` }}
        >
          <div>
            <span className="about-eyebrow">Ready To Grow</span>
            <h2>
              Let's Create Something
              <br />
              Amazing <strong>Together!</strong>
            </h2>
            <p>
              Whether you need stunning prints, great designs, powerful
              marketing or a new website, we are here to make it happen.
            </p>
          </div>
          <div className="about-actions">
            <Link to="/contact" className="about-primary-btn">
              Get Started Today <FaArrowRight />
            </Link>
            <Link to="/logo-design-gallery" className="about-dark-outline-btn">
              View Our Portfolio <FaCheckCircle />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
