import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const links = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "Graphic Design", path: "/graphic-design" },
  { label: "Printing Services", path: "/printing" },
  { label: "Logo Design Gallery", path: "/logo-design-gallery" },
  { label: "Business Card Design Gallery", path: "/business-card-design-gallery" },
  { label: "Business Card Printing Gallery", path: "/business-card-printing-gallery" },
  { label: "Privacy Policy", path: "/privacy-policy" },
  { label: "Terms of Service", path: "/terms" },
];

const SitemapPage = () => {
  return (
    <>
      <Helmet>
        <title>Sitemap</title>
      </Helmet>
      <section className="container mx-auto px-6 py-28 max-w-4xl">
        <h1 className="text-4xl font-bold text-brand-primary-800 mb-6">
          Sitemap
        </h1>
        <ul className="space-y-3">
          {links.map((item) => (
            <li key={item.path}>
              <Link className="text-[#E65056] hover:underline" to={item.path}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default SitemapPage;
