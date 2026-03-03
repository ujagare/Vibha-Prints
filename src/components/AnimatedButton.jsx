import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AnimatedButton = ({
  children,
  to,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  icon = null,
  iconPosition = "right",
  ...props
}) => {
  // Determine size classes
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  // Determine variant classes
  const variantClasses = {
    primary:
      "bg-brand-primary-800 text-white hover:shadow-lg hover:shadow-brand-primary-800/20",
    secondary:
      "bg-brand-secondary-500 text-white hover:shadow-lg hover:shadow-brand-secondary-500/20",
    outline:
      "bg-transparent border-2 border-brand-primary-800 text-brand-primary-800 hover:bg-brand-primary-50",
    ghost: "bg-transparent text-brand-primary-800 hover:bg-brand-primary-50",
    light: "bg-white text-brand-primary-800 hover:bg-gray-50",
  };

  // Common button classes
  const buttonClasses = `
    inline-flex items-center justify-center
    rounded-full font-medium
    transition-all duration-300
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `;

  // Animation variants
  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  };

  // Icon animation variants
  const iconVariants = {
    initial: { x: 0 },
    hover:
      iconPosition === "right"
        ? { x: 5, transition: { type: "spring", stiffness: 400 } }
        : { x: -5, transition: { type: "spring", stiffness: 400 } },
  };

  // Render the appropriate element based on props
  if (to) {
    return (
      <motion.div
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
      >
        <Link to={to} className={buttonClasses} {...props}>
          {iconPosition === "left" && icon && (
            <motion.span variants={iconVariants} className="mr-2">
              {icon}
            </motion.span>
          )}
          {children}
          {iconPosition === "right" && icon && (
            <motion.span variants={iconVariants} className="ml-2">
              {icon}
            </motion.span>
          )}
        </Link>
      </motion.div>
    );
  } else if (href) {
    return (
      <motion.div
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
      >
        <a href={href} className={buttonClasses} {...props}>
          {iconPosition === "left" && icon && (
            <motion.span variants={iconVariants} className="mr-2">
              {icon}
            </motion.span>
          )}
          {children}
          {iconPosition === "right" && icon && (
            <motion.span variants={iconVariants} className="ml-2">
              {icon}
            </motion.span>
          )}
        </a>
      </motion.div>
    );
  } else {
    return (
      <motion.button
        onClick={onClick}
        className={buttonClasses}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
        {...props}
      >
        {iconPosition === "left" && icon && (
          <motion.span variants={iconVariants} className="mr-2">
            {icon}
          </motion.span>
        )}
        {children}
        {iconPosition === "right" && icon && (
          <motion.span variants={iconVariants} className="ml-2">
            {icon}
          </motion.span>
        )}
      </motion.button>
    );
  }
};

export default AnimatedButton;
