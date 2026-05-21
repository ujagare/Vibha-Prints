import React from "react";

const Terms = () => {
  return (
    <section className="container mx-auto px-6 py-28 max-w-4xl">
      <article aria-labelledby="terms-title">
        <h1
          id="terms-title"
          className="text-4xl font-bold text-brand-primary-800 mb-6"
        >
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
          <a className="text-[#E65056]" href="mailto:info@vibhaprints.com">
            info@vibhaprints.com
          </a>
          {" "}or{" "}
          <a className="text-[#E65056]" href="mailto:vibhart07@gmail.com">
            vibhart07@gmail.com
          </a>
          .
        </p>
      </article>
    </section>
  );
};

export default Terms;
