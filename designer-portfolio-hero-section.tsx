import React from "react";

const expertise = [
  "Brand Identity Design",
  "Packaging Design",
  "Social Media Creatives",
  "Print & Marketing Collateral",
];

const stats = [
  { label: "Years of Experience", value: "5+" },
  { label: "Projects Delivered", value: "250+" },
  { label: "Happy Clients", value: "100+" },
];

const DesignerPortfolioHeroSection: React.FC = () => (
  <section className="bg-white px-6 py-16 sm:px-10 lg:px-16">
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
            About Me
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            Helping brands look clear, memorable, and premium.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 sm:text-lg">
            I am Vibha, a visual designer focused on branding and marketing
            design. My work blends strategy, clean aesthetics, and practical
            execution so businesses can communicate better and grow faster.
          </p>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg">
            From logo systems to campaign assets, I build design experiences
            that stay consistent across digital and print touchpoints.
          </p>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-7 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-neutral-900">What I Do</h2>
          <ul className="mt-5 space-y-3">
            {expertise.map((item) => (
              <li key={item} className="flex items-center gap-3 text-neutral-700">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <a
            href="/contact"
            className="mt-7 inline-flex rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
          >
            Let's Work Together
          </a>
        </div>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm"
          >
            <p className="text-3xl font-semibold text-neutral-900">{item.value}</p>
            <p className="mt-1 text-sm text-neutral-600">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default DesignerPortfolioHeroSection;