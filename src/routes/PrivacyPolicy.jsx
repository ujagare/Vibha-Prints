import React from "react";
import { Helmet } from "react-helmet-async";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy</title>
      </Helmet>
      <section className="container mx-auto px-6 py-28 max-w-4xl">
        <h1 className="text-4xl font-bold text-brand-primary-800 mb-6">
          Privacy Policy
        </h1>
        <p className="text-gray-700 mb-4">
          We collect only the information you submit in contact forms, chat, or
          quote requests to respond to your project inquiry.
        </p>
        <p className="text-gray-700 mb-4">
          Your data is used for communication and service delivery only. We do
          not sell personal information to third parties.
        </p>
        <p className="text-gray-700">
          For any privacy request, contact us at{" "}
          <a className="text-[#E65056]" href="mailto:vibhart07@gmail.com">
            vibhart07@gmail.com
          </a>
          .
        </p>
      </section>
    </>
  );
};

export default PrivacyPolicy;
