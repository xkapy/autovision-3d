import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, ArrowRight, Sparkles, ImagePlus } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import type { PhotoAngle } from '../../types';

const angleConfig: { angle: PhotoAngle; label: string; hint: string; icon: string }[] = [
  { angle: 'front', label: 'Front', hint: 'Straight-on front view', icon: '🚗' },
  { angle: 'back', label: 'Rear', hint: 'Straight-on rear view', icon: '🔙' },
  { angle: 'left', label: 'Left Side', hint: 'Full left profile', icon: '◀️' },
  { angle: 'right', label: 'Right Side', hint: 'Full right profile', icon: '▶️' },
];

function UploadZone({ angle, label, hint, icon }: typeof angleConfig[number]) {
  const { photos, setPhoto, removePhoto } = useAppStore();
  const slot = photos[angle];

  const onDrop = useCallback(
    (files: File[]) => {
      if (files[0]) setPhoto(angle, files[0]);
    },
    [angle, setPhoto]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    multiple: false,
  });

  if (slot.status === 'ready' && slot.preview) {
    return (
      <motion.div
        layout
        className="relative aspect-[4/3] rounded-[var(--radius)] overflow-hidden group"
      >
        <img
          src={slot.preview}
          alt={label}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--danger)] text-white rounded-full p-2 cursor-pointer shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              removePhoto(angle);
            }}
          >
            <X size={16} />
          </motion.button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <p className="text-white text-sm font-medium">{label}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        aspect-[4/3] rounded-[var(--radius)] border-2 border-dashed cursor-pointer
        flex flex-col items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden
        ${isDragActive
          ? 'border-[var(--accent)] bg-[var(--accent-glow)] scale-[1.02]'
          : 'border-[var(--border-subtle)] hover:border-[var(--accent)] hover:bg-[var(--surface)]'
        }
      `}
    >
      <input {...getInputProps()} />
      {/* Car silhouette guide */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none">
        <span className="text-8xl">{icon}</span>
      </div>
      <motion.div
        animate={isDragActive ? { scale: 1.2, rotate: 5 } : { scale: 1, rotate: 0 }}
        className="text-[var(--accent)]"
      >
        <ImagePlus size={32} />
      </motion.div>
      <div className="text-center">
        <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">{hint}</p>
      </div>
    </div>
  );
}

export function PhotoUploader() {
  const { allPhotosReady, setStep, photos } = useAppStore();
  const uploadedCount = Object.values(photos).filter((s) => s.status === 'ready').length;
  const isReady = allPhotosReady();

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">
          Upload Car Photos
        </h2>
        <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
          Provide 4 photos of your vehicle — front, rear, left and right sides.
          Clear, well-lit photos produce the best 3D results.
        </p>
      </motion.div>

      {/* Photo Tips */}
      <GlassCard className="mb-6">
        <div className="flex items-start gap-3">
          <Sparkles size={20} className="text-[var(--accent)] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Tips for best results</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Shoot at eye level • Avoid heavy shadows • Keep the car centered •
              Use consistent lighting • Minimum 1024×768 resolution
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Upload Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {angleConfig.map((cfg) => (
          <UploadZone key={cfg.angle} {...cfg} />
        ))}
      </div>

      {/* Progress & Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[var(--text-secondary)]">
          <span className="font-semibold text-[var(--accent)]">{uploadedCount}</span> / 4 photos uploaded
        </p>
        <Button
          size="lg"
          disabled={!isReady}
          icon={<ArrowRight size={18} />}
          onClick={() => setStep('generate')}
        >
          Generate 3D Model
        </Button>
      </div>
    </div>
  );
}
