import React from "react";
import CountUp from "react-countup";

const numberPattern = /^([^0-9-]*)(-?\d[\d,]*(?:\.\d+)?)(.*)$/;

const AnimatedNumber = ({
  value,
  duration = 1.8,
  className = "",
  style,
  as: Component = "span",
}) => {
  const rawValue = String(value ?? "").trim();
  const match = rawValue.match(numberPattern);

  if (!match) {
    return (
      <Component className={className} style={style}>
        {value}
      </Component>
    );
  }

  const [, prefix, numericValue, suffix] = match;
  const normalizedValue = Number(numericValue.replace(/,/g, ""));
  const decimals = numericValue.includes(".")
    ? numericValue.split(".")[1].length
    : 0;

  return (
    <Component className={className} style={style}>
      <CountUp
        start={0}
        end={normalizedValue}
        duration={duration}
        decimals={decimals}
        separator=","
        prefix={prefix}
        suffix={suffix}
        enableScrollSpy
        scrollSpyOnce
        scrollSpyDelay={120}
      >
        {({ countUpRef }) => <span ref={countUpRef} />}
      </CountUp>
    </Component>
  );
};

export default AnimatedNumber;
