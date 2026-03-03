"use client";

import React, { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";

export const PrismFluxLoader = ({ size = 30, speed = 5, textSize = 50 }) => {
  const [time, setTime] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const statuses = [
    "Fetching",
    "Fixing",
    "Updating",
    "Placing",
    "Syncing",
    "Processing",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 0.02 * speed);
    }, 16);
    return () => clearInterval(interval);
  }, [speed]);

  useEffect(() => {
    const statusInterval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statuses.length);
    }, 600);
    return () => clearInterval(statusInterval);
  }, [statuses.length]);

  const half = size / 2;
  const currentStatus = statuses[statusIndex];

  return (
    <div className="flex h-[220px] flex-col items-center justify-center gap-7 text-white [perspective:900px]">
      <div
        className="relative"
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
          transform: `rotateY(${time * 30}deg) rotateX(${time * 30}deg)`,
        }}
      >
        {statuses.slice(0, 6).map((_, i) => {
          const faceTransforms = [
            `rotateY(0deg) translateZ(${half}px)`,
            `rotateY(180deg) translateZ(${half}px)`,
            `rotateY(90deg) translateZ(${half}px)`,
            `rotateY(-90deg) translateZ(${half}px)`,
            `rotateX(90deg) translateZ(${half}px)`,
            `rotateX(-90deg) translateZ(${half}px)`,
          ];

          return (
            <div
              key={i}
              className="absolute flex items-center justify-center font-semibold text-white"
              style={{
                width: size,
                height: size,
                border: "1.5px solid rgba(255,255,255,0.85)",
                backgroundColor: "rgba(255,255,255,0.05)",
                boxShadow: "0 0 18px rgba(255,255,255,0.08) inset",
                transform: faceTransforms[i],
                backfaceVisibility: "hidden",
                fontSize: `${textSize}px`,
              }}
            >
              <PlusIcon
                size={Math.max(18, Math.round(textSize * 0.72))}
                strokeWidth={2.2}
              />
            </div>
          );
        })}
      </div>

      <div className="text-lg font-semibold tracking-wide text-white/90">
        {currentStatus}...
      </div>
    </div>
  );
};

export default PrismFluxLoader;
