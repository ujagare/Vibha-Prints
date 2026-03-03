import React from "react";
import { FaStar } from "react-icons/fa";
import jainImage from "../assets/jain.jpeg";

const reviews = [
  {
    id: 1,
    name: "Ankita Jain",
    username: "CEO, TechSolutions India",
    body: "Working with Komal has been an absolute pleasure. Her ability to adapt to each customer need is unmatched, and her patience throughout the process makes every project smooth and enjoyable.",
    img: jainImage,
    rating: 5,
  },
  {
    id: 2,
    name: "Priya Sharma",
    username: "Marketing Director, Fusion Foods",
    body: "Vibha Art was a game-changer for our packaging. Designs were creative, print quality was excellent, and customer feedback was fantastic.",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=300&q=80",
    rating: 5,
  },
  {
    id: 3,
    name: "Amit Patel",
    username: "Founder, StartUp Ventures",
    body: "We needed a strong brand identity and they delivered exactly that. Professional, responsive, and genuinely invested in our growth.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
    rating: 5,
  },
  {
    id: 4,
    name: "Sunita Reddy",
    username: "Event Manager, Celebration Planners",
    body: "From invitations to event banners, everything looked cohesive and elegant. Turnaround and support were excellent.",
    img: "https://images.unsplash.com/photo-1598550880863-4e8aa3d0edb4?auto=format&fit=crop&w=300&h=300&q=80",
    rating: 5,
  },
  {
    id: 5,
    name: "Vikram Singh",
    username: "Owner, Luxury Boutique",
    body: "Business cards and packaging captured our luxury positioning perfectly. Attention to detail is their biggest strength.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80",
    rating: 4,
  },
  {
    id: 6,
    name: "Neha Kulkarni",
    username: "Founder, Bloom Naturals",
    body: "Great design sense and consistent print quality. Communication was smooth from first draft to final delivery.",
    img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&h=300&q=80",
    rating: 5,
  },
];

const firstRow = reviews.slice(0, Math.ceil(reviews.length / 2));
const secondRow = reviews.slice(Math.ceil(reviews.length / 2));

const ReviewCard = ({ img, name, username, body, rating }) => {
  return (
    <figure className="relative h-full w-72 cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <img
          className="h-10 w-10 rounded-full object-cover"
          width="40"
          height="40"
          alt={name}
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-semibold text-gray-800">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-gray-500">{username}</p>
        </div>
      </div>
      <blockquote className="mt-3 text-sm text-gray-600">{body}</blockquote>
      <div className="mt-3 flex">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <FaStar
              key={i}
              className={i < rating ? "text-yellow-400" : "text-gray-300"}
            />
          ))}
      </div>
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
      className="py-24 bg-gradient-to-b from-white to-brand-primary-50 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary-100 rounded-full opacity-20 -mr-48 -mt-48 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-secondary-100 rounded-full opacity-20 -ml-48 -mb-48 blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-[#E65056]/10 text-[#E65056] rounded-full text-sm font-medium tracking-wide mb-4">
            TESTIMONIALS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-[#01334C]">Client </span>
            <span className="text-[#E65056]">Experiences</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here is what our clients say about
            our design and printing services.
          </p>
        </div>
      </div>

      <div className="relative left-1/2 w-screen -translate-x-1/2 flex flex-col items-center justify-center overflow-hidden gap-4 px-2 md:px-4">
        <MarqueeRow items={firstRow} />
        <MarqueeRow items={secondRow} reverse />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-brand-primary-50 to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-brand-primary-50 to-transparent"></div>
      </div>
    </section>
  );
};

export default Testimonials;
