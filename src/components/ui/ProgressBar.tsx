import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  label?: string;
}

export function ProgressBar({ progress, label }: ProgressBarProps) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-[var(--text-secondary)]">{label}</span>
          <span className="text-sm font-medium text-[var(--accent)]">{Math.round(progress)}%</span>
        </div>
      )}
      <div className="h-2 rounded-full bg-[var(--surface)] overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ boxShadow: '0 0 12px var(--accent-glow)' }}
        />
      </div>
    </div>
  );
}
