import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { Header } from './components/layout/Header';
import { PhotoUploader } from './components/upload/PhotoUploader';
import { GeneratePage } from './components/upload/GeneratePage';
import { ModelViewer } from './components/viewer/ModelViewer';
import { EditorPanel } from './components/editor/EditorPanel';
import { ExportDialog } from './components/export/ExportDialog';
import { ToastContainer } from './components/ui/Toast';
import { Button } from './components/ui/Button';
import { useAppStore } from './stores/appStore';
import { useThemeStore } from './stores/themeStore';

function ViewerPage() {
  const setStep = useAppStore((s) => s.setStep);

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 min-h-0">
      {/* 3D Viewer */}
      <div className="flex-1 flex flex-col min-h-[50vh] lg:min-h-0">
        <ModelViewer />
        <div className="mt-3 flex justify-end">
          <Button
            size="md"
            icon={<Download size={16} />}
            onClick={() => setStep('export')}
          >
            Export Model
          </Button>
        </div>
      </div>
      {/* Editor Sidebar */}
      <EditorPanel />
    </div>
  );
}

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

export default function App() {
  const currentStep = useAppStore((s) => s.currentStep);
  const { mode } = useThemeStore();

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode === 'night' ? 'dark' : '');
  }, [mode]);

  return (
    <div className="flex flex-col min-h-screen h-screen overflow-hidden">
      <Header />
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex-1 flex flex-col"
          >
            {currentStep === 'upload' && <PhotoUploader />}
            {currentStep === 'generate' && <GeneratePage />}
            {currentStep === 'viewer' && <ViewerPage />}
            {currentStep === 'export' && <ExportDialog />}
          </motion.div>
        </AnimatePresence>
      </main>
      <ToastContainer />
    </div>
  );
}
