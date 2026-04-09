import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Key, Zap, ArrowLeft } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';
import { ProgressBar } from '../ui/ProgressBar';
import { generateDemo, generateWithMeshy } from '../../services/generationService';

export function GeneratePage() {
  const {
    photos,
    apiKey,
    setApiKey,
    generationStatus,
    generationProgress,
    setGenerationStatus,
    setGenerationProgress,
    setModelUrl,
    setStep,
    addToast,
  } = useAppStore();

  const [statusText, setStatusText] = useState('');
  const [mode, setMode] = useState<'demo' | 'meshy'>('demo');
  const isGenerating = generationStatus === 'generating' || generationStatus === 'uploading';

  const handleGenerate = async () => {
    setGenerationStatus('generating');
    setGenerationProgress(0);

    const callbacks = {
      onProgress: setGenerationProgress,
      onStatusChange: setStatusText,
    };

    try {
      if (mode === 'meshy' && apiKey) {
        const url = await generateWithMeshy(photos, apiKey, callbacks);
        setModelUrl(url);
        addToast({ type: 'success', message: '3D model generated successfully!' });
      } else {
        await generateDemo(callbacks);
        // Demo mode: null URL means use built-in model
        setGenerationStatus('ready');
        setStep('viewer');
        addToast({ type: 'success', message: 'Demo model loaded! Try the editor.' });
      }
    } catch (err: any) {
      setGenerationStatus('error');
      addToast({ type: 'error', message: err.message || 'Generation failed' });
    }
  };

  const uploadedCount = Object.values(photos).filter((s) => s.status === 'ready').length;

  return (
    <div className="max-w-xl mx-auto w-full px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">
          Generate 3D Model
        </h2>
        <p className="text-[var(--text-secondary)]">
          {uploadedCount} photo{uploadedCount !== 1 ? 's' : ''} ready for processing
        </p>
      </motion.div>

      {/* Mode Selection */}
      {!isGenerating && (
        <GlassCard className="mb-6">
          <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            Generation Mode
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode('demo')}
              className={`p-3 rounded-[var(--radius-sm)] text-center cursor-pointer transition-all duration-200 ${
                mode === 'demo'
                  ? 'bg-[var(--accent)] text-white shadow-md'
                  : 'glass-subtle text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Zap size={20} className="mx-auto mb-1" />
              <p className="text-sm font-medium">Demo Mode</p>
              <p className={`text-xs mt-0.5 ${mode === 'demo' ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>
                Instant preview, no API key
              </p>
            </button>
            <button
              onClick={() => setMode('meshy')}
              className={`p-3 rounded-[var(--radius-sm)] text-center cursor-pointer transition-all duration-200 ${
                mode === 'meshy'
                  ? 'bg-[var(--accent)] text-white shadow-md'
                  : 'glass-subtle text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Cpu size={20} className="mx-auto mb-1" />
              <p className="text-sm font-medium">Meshy AI</p>
              <p className={`text-xs mt-0.5 ${mode === 'meshy' ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>
                Real AI generation
              </p>
            </button>
          </div>

          {mode === 'meshy' && (
            <div className="mt-4">
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 flex items-center gap-1.5">
                <Key size={12} /> Meshy API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Meshy API key..."
                className="w-full glass-subtle px-3 py-2 text-sm text-[var(--text-primary)] bg-transparent outline-none"
              />
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Get a key at{' '}
                <a href="https://meshy.ai" target="_blank" rel="noopener" className="text-[var(--accent)] underline">
                  meshy.ai
                </a>
              </p>
            </div>
          )}
        </GlassCard>
      )}

      {/* Progress */}
      {isGenerating && (
        <GlassCard className="mb-6">
          {/* Animated wireframe car icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-[var(--surface)] flex items-center justify-center animate-pulse-glow">
              <Cpu size={32} className="text-[var(--accent)] animate-spin-slow" />
            </div>
          </div>
          <ProgressBar progress={generationProgress} label={statusText || 'Processing...'} />
        </GlassCard>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="ghost"
          icon={<ArrowLeft size={16} />}
          onClick={() => setStep('upload')}
          disabled={isGenerating}
        >
          Back
        </Button>
        <Button
          size="lg"
          className="flex-1"
          icon={<Cpu size={18} />}
          onClick={handleGenerate}
          disabled={isGenerating || (mode === 'meshy' && !apiKey)}
        >
          {isGenerating
            ? 'Generating...'
            : mode === 'demo'
              ? 'Generate Demo Model'
              : 'Generate with Meshy AI'}
        </Button>
      </div>
    </div>
  );
}
