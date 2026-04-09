import { motion } from 'framer-motion';
import type { ReactNode, HTMLAttributes } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddings = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

export function GlassCard({
  children,
  hover = true,
  padding = 'md',
  className = '',
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={`glass ${paddings[padding]} ${className}`}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
}
