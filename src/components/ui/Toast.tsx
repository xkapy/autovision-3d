import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';

const icons = {
  success: <CheckCircle size={18} className="text-[var(--success)]" />,
  error: <AlertCircle size={18} className="text-[var(--danger)]" />,
  info: <Info size={18} className="text-[var(--accent)]" />,
  warning: <AlertTriangle size={18} className="text-[var(--warning)]" />,
};

export function ToastContainer() {
  const { toasts, removeToast } = useAppStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="glass flex items-center gap-3 px-4 py-3 pr-10 relative"
          >
            {icons[toast.type]}
            <p className="text-sm text-[var(--text-primary)]">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
