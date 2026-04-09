import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileBox, Printer, FileCode, Camera, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';
import { useAppStore } from '../../stores/appStore';
import type { ExportFormat } from '../../types';

const formats: ExportFormat[] = [
  {
    id: 'glb',
    name: 'GLB (GLTF Binary)',
    description: 'Best for Blender, Unity, Unreal. Preserves textures & materials.',
    extension: '.glb',
  },
  {
    id: 'stl',
    name: 'STL (Stereolithography)',
    description: '3D printing standard. Geometry only, no color/texture.',
    extension: '.stl',
  },
  {
    id: 'obj',
    name: 'OBJ (Wavefront)',
    description: 'Broad compatibility with legacy tools. Geometry only.',
    extension: '.obj',
  },
];

const formatIcons = {
  glb: <FileBox size={24} />,
  stl: <Printer size={24} />,
  obj: <FileCode size={24} />,
};

export function ExportDialog() {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat['id']>('glb');
  const [isExporting, setIsExporting] = useState(false);
  const { addToast, setStep } = useAppStore();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Dynamic import to keep bundle small
      const { exportModel } = await import('../../utils/exportUtils');
      await exportModel(selectedFormat);
      addToast({ type: 'success', message: `Model exported as ${selectedFormat.toUpperCase()}` });
    } catch (err) {
      addToast({ type: 'error', message: 'Export failed. Please try again.' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'autovision-3d-screenshot.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      addToast({ type: 'success', message: 'Screenshot saved!' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">
          Export Your Model
        </h2>
        <p className="text-[var(--text-secondary)]">
          Choose a format and download your 3D model
        </p>
      </motion.div>

      <div className="grid gap-3 mb-6">
        {formats.map((fmt) => (
          <motion.button
            key={fmt.id}
            onClick={() => setSelectedFormat(fmt.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-[var(--radius)] cursor-pointer transition-all duration-200 text-left ${
              selectedFormat === fmt.id
                ? 'bg-[var(--accent)] text-white shadow-lg scale-[1.01]'
                : 'glass text-[var(--text-primary)] hover:bg-[var(--bg-glass-hover)]'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className={`p-2 rounded-[var(--radius-sm)] ${
              selectedFormat === fmt.id ? 'bg-white/20' : 'bg-[var(--surface)]'
            }`}>
              {formatIcons[fmt.id]}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{fmt.name}</p>
              <p className={`text-xs mt-0.5 ${
                selectedFormat === fmt.id ? 'text-white/70' : 'text-[var(--text-muted)]'
              }`}>
                {fmt.description}
              </p>
            </div>
            <span className={`text-xs font-mono ${
              selectedFormat === fmt.id ? 'text-white/60' : 'text-[var(--text-muted)]'
            }`}>
              {fmt.extension}
            </span>
          </motion.button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          icon={<Download size={18} />}
          onClick={handleExport}
          disabled={isExporting}
          className="flex-1"
        >
          {isExporting ? 'Exporting...' : `Export as ${selectedFormat.toUpperCase()}`}
        </Button>
        <Button
          variant="secondary"
          size="lg"
          icon={<Camera size={18} />}
          onClick={handleScreenshot}
        >
          Screenshot
        </Button>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => setStep('viewer')}
          className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] cursor-pointer transition-colors"
        >
          ← Back to Editor
        </button>
      </div>
    </div>
  );
}
