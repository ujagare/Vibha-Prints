import React from "react";
import { useParams } from "react-router-dom";
import ServiceLandingTemplate from "../components/ServiceLandingTemplate";
import NotFound from "./NotFound";
import { serviceLandingPagesBySlug } from "../data/serviceLandingPages";

const ServicePage = () => {
  const { slug } = useParams();
  const page = serviceLandingPagesBySlug[slug];

  if (!page) return <NotFound />;

  return <ServiceLandingTemplate page={page} />;
};

export default ServicePage;
