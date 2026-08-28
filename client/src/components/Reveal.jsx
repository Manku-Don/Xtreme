import { motion } from "framer-motion";

export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className = "",
  once = true,
  as = "div",
  ...rest
}) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.25 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </Comp>
  );
}
