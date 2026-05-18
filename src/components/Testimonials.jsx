import React from "react";
import {
  Quote as FaQuoteRight,
  Star as FaStar,
} from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Ankita Jain",
    username: "CEO, TechSolutions India",
    body: "Working with Komal has been an absolute pleasure. Her ability to adapt to each customer need is unmatched, and her patience throughout the process makes every project smooth and enjoyable.",
    rating: 5,
  },
  {
    id: 2,
    name: "Priya Sharma",
    username: "Marketing Director, Fusion Foods",
    body: "Vibha Art was a game-changer for our packaging. Designs were creative, print quality was excellent, and customer feedback was fantastic.",
    rating: 5,
  },
  {
    id: 3,
    name: "Amit Patel",
    username: "Founder, StartUp Ventures",
    body: "We needed a strong brand identity and they delivered exactly that. Professional, responsive, and genuinely invested in our growth.",
    rating: 5,
  },
  {
    id: 4,
    name: "Sunita Reddy",
    username: "Event Manager, Celebration Planners",
    body: "From invitations to event banners, everything looked cohesive and elegant. Turnaround and support were excellent.",
    rating: 5,
  },
  {
    id: 5,
    name: "Vikram Singh",
    username: "Owner, Luxury Boutique",
    body: "Business cards and packaging captured our luxury positioning perfectly. Attention to detail is their biggest strength.",
    rating: 4,
  },
  {
    id: 6,
    name: "Neha Kulkarni",
    username: "Founder, Bloom Naturals",
    body: "Great design sense and consistent print quality. Communication was smooth from first draft to final delivery.",
    rating: 5,
  },
];

const firstRow = reviews.slice(0, Math.ceil(reviews.length / 2));
const secondRow = reviews.slice(Math.ceil(reviews.length / 2));

const ReviewCard = ({ name, username, body, rating }) => {
  return (
    <figure className="group relative flex h-[260px] w-[350px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-lg border border-[#e4e9f2] bg-white p-6 shadow-[0_18px_50px_rgba(7,17,36,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#ff525d]/35 hover:shadow-[0_26px_70px_rgba(7,17,36,0.14)] sm:w-[390px]">
      <div className="absolute right-5 top-5 text-5xl text-[#ff525d]/10 transition duration-300 group-hover:text-[#ff525d]/18">
        <FaQuoteRight />
      </div>
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <figcaption className="text-lg font-extrabold text-[#071124]">
            {name}
          </figcaption>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#64748b]">
            {username}
          </p>
        </div>
        <div className="flex shrink-0 rounded-full border border-[#f8d3d6] bg-[#fff3f4] px-3 py-1.5">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <FaStar
                key={i}
                className={`text-sm ${
                  i < rating ? "text-[#ffb703]" : "text-[#d9dee8]"
                }`}
              />
            ))}
        </div>
      </div>
      <blockquote className="relative z-10 mt-6 flex-1 text-[15px] leading-8 text-[#536176]">
        “{body}”
      </blockquote>
      <div className="relative z-10 mt-5 h-1 w-20 rounded-full bg-[#ff525d]" />
    </figure>
  );
};

const MarqueeRow = ({ items, reverse = false }) => {
  const loopItems = [...items, ...items, ...items];

  return (
    <div className="testimonial-marquee-row">
      <div
        className={`testimonial-marquee-track ${reverse ? "testimonial-marquee-track-reverse" : ""}`}
      >
        {loopItems.map((review, index) => (
          <ReviewCard key={`${review.id}-${index}`} {...review} />
        ))}
      </div>
    </div>
  );
};

const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-[#f7f9fc] py-20 sm:py-24"
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,17,36,0.045)_1px,transparent_1px),linear-gradient(180deg,rgba(7,17,36,0.04)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d9e0ec] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#d9e0ec] to-transparent" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-[#d6dce8] bg-white px-4 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#071124] shadow-sm">
            TESTIMONIALS
          </span>
          <h2 className="mt-4 text-4xl font-extrabold leading-tight text-[#071124] sm:text-5xl">
            Client <span className="text-[#ff525d]">Experiences</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#536176]">
            Don't just take our word for it. Here is what our clients say about
            our design and printing services.
          </p>
        </div>
      </div>

      <div className="relative left-1/2 z-10 flex w-screen -translate-x-1/2 flex-col items-center justify-center gap-5 overflow-hidden px-2 md:px-4">
        <MarqueeRow items={firstRow} />
        <MarqueeRow items={secondRow} reverse />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-[#f7f9fc] to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-[#f7f9fc] to-transparent"></div>
      </div>
    </section>
  );
};

export default Testimonials;
