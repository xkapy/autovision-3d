import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';

export function ThemeToggle() {
  const { mode, toggleTheme } = useThemeStore();
  const isDark = mode === 'night';

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full glass cursor-pointer flex items-center px-1"
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        className="w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-md"
        animate={{ x: isDark ? 26 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <motion.div
          key={mode}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? (
            <Moon size={12} className="text-white" />
          ) : (
            <Sun size={12} className="text-white" />
          )}
        </motion.div>
      </motion.div>
    </motion.button>
  );
}
