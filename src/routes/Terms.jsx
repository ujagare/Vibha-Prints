import React from "react";
import { Helmet } from "react-helmet-async";

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service</title>
      </Helmet>
      <section className="container mx-auto px-6 py-28 max-w-4xl">
        <h1 className="text-4xl font-bold text-brand-primary-800 mb-6">
          Terms of Service
        </h1>
        <p className="text-gray-700 mb-4">
          By using Vibha Art services, you agree to provide accurate project
          details and approve final designs before print production starts.
        </p>
        <p className="text-gray-700 mb-4">
          Timelines depend on scope, revisions, and material availability. Any
          urgent jobs may include additional charges.
        </p>
        <p className="text-gray-700">
          For support, contact us at{" "}
          <a className="text-[#E65056]" href="mailto:vibhart07@gmail.com">
            vibhart07@gmail.com
          </a>
          .
        </p>
      </section>
    </>
  );
};

export default Terms;
