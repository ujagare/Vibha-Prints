import React from "react";
import { useParams } from "react-router-dom";
import ServiceLandingTemplate from "../components/ServiceLandingTemplate";
import NotFound from "./NotFound";
import { serviceLandingPagesBySlug } from "../data/serviceLandingPages";
import SEO from "../seo/SEO";

const seoPageBySlug = {
  "graphic-design": "logo-design",
  printing: "large-format-printing",
  "digital-marketing": "services",
  "web-development": "services",
};

const ServicePage = () => {
  const { slug } = useParams();
  const page = serviceLandingPagesBySlug[slug];

  if (!page) return <NotFound />;

  return (
    <>
      <SEO
        page={seoPageBySlug[slug] || "services"}
        customPath={`/services/${slug}`}
        customTitle={`${page.seo?.title || page.hero?.title || page.title} | Vibha Art Pune`}
        customDesc={
          page.seo?.description ||
          page.hero?.description ||
          `Explore ${page.title} services from Vibha Art for professional design, printing and digital growth in Pune.`
        }
        customKeywords={
          page.seo?.keywords ||
          `${page.title}, Vibha Art Pune, design services pune, printing services pune`
        }
      />
      <ServiceLandingTemplate page={page} />
    </>
  );
};

export default ServicePage;
