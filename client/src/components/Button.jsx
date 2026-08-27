import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const VARIANTS = {
  primary:
    "bg-plate-red text-chalk hover:bg-plate-red-dim shadow-[0_0_0_1px_rgba(214,40,40,0.4)]",
  ghost:
    "bg-transparent text-chalk border border-line-strong hover:border-chalk hover:bg-panel-2",
  light:
    "bg-bone-ink text-bone hover:bg-black",
};

export default function Button({
  children,
  to,
  href,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  ...rest
}) {
  const classes = `text-stencil inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3.5 text-sm font-bold tracking-[0.12em] transition-colors duration-200 ${VARIANTS[variant]} ${className}`;

  const content = (
    <motion.span
      className="inline-flex items-center gap-2"
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.span>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} target="_blank" rel="noreferrer" {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} {...rest}>
      {content}
    </button>
  );
}
