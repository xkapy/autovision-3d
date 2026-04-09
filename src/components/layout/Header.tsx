import { motion } from 'framer-motion';
import { Car, Settings, Upload, Cpu, Eye, Download } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useAppStore } from '../../stores/appStore';
import type { AppStep } from '../../types';

const steps: { id: AppStep; label: string; icon: React.ReactNode }[] = [
  { id: 'upload', label: 'Upload', icon: <Upload size={16} /> },
  { id: 'generate', label: 'Generate', icon: <Cpu size={16} /> },
  { id: 'viewer', label: 'View & Edit', icon: <Eye size={16} /> },
  { id: 'export', label: 'Export', icon: <Download size={16} /> },
];

export function Header() {
  const { currentStep, setStep, generationStatus } = useAppStore();

  const canNavigateTo = (step: AppStep) => {
    if (step === 'upload') return true;
    if (step === 'generate') return true;
    if (step === 'viewer') return generationStatus === 'ready';
    if (step === 'export') return generationStatus === 'ready';
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-glass)] backdrop-blur-xl border-b border-[var(--border-glass)] shadow-lg flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2.5 cursor-pointer select-none"
          whileHover={{ scale: 1.02 }}
          onClick={() => setStep('upload')}
        >
          <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-[var(--accent)] flex items-center justify-center shadow-lg">
            <Car size={20} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-bold text-[var(--text-primary)] leading-tight">
              AutoVision
            </h1>
            <p className="text-[10px] font-medium text-[var(--accent)] tracking-widest uppercase">
              3D Studio
            </p>
          </div>
        </motion.div>

        {/* Step Indicator */}
        <nav className="hidden md:flex items-center gap-1">
          {steps.map((step, i) => {
            const isActive = currentStep === step.id;
            const isClickable = canNavigateTo(step.id);
            return (
              <div key={step.id} className="flex items-center">
                <motion.button
                  onClick={() => isClickable && setStep(step.id)}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                    transition-all duration-300 cursor-pointer
                    ${isActive
                      ? 'bg-[var(--accent)] text-white shadow-md'
                      : isClickable
                        ? 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)]'
                        : 'text-[var(--text-muted)] opacity-50 cursor-not-allowed'
                    }
                  `}
                  whileHover={isClickable ? { scale: 1.05 } : undefined}
                  whileTap={isClickable ? { scale: 0.95 } : undefined}
                >
                  {step.icon}
                  <span>{step.label}</span>
                </motion.button>
                {i < steps.length - 1 && (
                  <div className="w-6 h-px bg-[var(--border-subtle)] mx-1" />
                )}
              </div>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
      <div className="accent-line" />
    </header>
  );
}
