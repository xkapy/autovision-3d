import { create } from 'zustand';
import type { AppStep, GenerationStatus, ToastMessage, PhotoAngle, PhotoSlot, PhotoCollection } from '../types';

const emptySlot: PhotoSlot = { file: null, preview: null, status: 'empty' };

interface AppState {
  // Navigation
  currentStep: AppStep;
  setStep: (step: AppStep) => void;

  // Photos
  photos: PhotoCollection;
  setPhoto: (angle: PhotoAngle, file: File) => void;
  removePhoto: (angle: PhotoAngle) => void;
  clearPhotos: () => void;
  allPhotosReady: () => boolean;

  // Generation
  generationStatus: GenerationStatus;
  generationProgress: number;
  modelUrl: string | null;
  setGenerationStatus: (status: GenerationStatus) => void;
  setGenerationProgress: (progress: number) => void;
  setModelUrl: (url: string) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Settings
  apiKey: string;
  setApiKey: (key: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentStep: 'upload',
  setStep: (step) => set({ currentStep: step }),

  photos: { front: { ...emptySlot }, back: { ...emptySlot }, left: { ...emptySlot }, right: { ...emptySlot } },
  setPhoto: (angle, file) => {
    const preview = URL.createObjectURL(file);
    set((state) => ({
      photos: {
        ...state.photos,
        [angle]: { file, preview, status: 'ready' as const },
      },
    }));
  },
  removePhoto: (angle) => {
    const current = get().photos[angle];
    if (current.preview) URL.revokeObjectURL(current.preview);
    set((state) => ({
      photos: { ...state.photos, [angle]: { ...emptySlot } },
    }));
  },
  clearPhotos: () => {
    const photos = get().photos;
    Object.values(photos).forEach((slot) => {
      if (slot.preview) URL.revokeObjectURL(slot.preview);
    });
    set({ photos: { front: { ...emptySlot }, back: { ...emptySlot }, left: { ...emptySlot }, right: { ...emptySlot } } });
  },
  allPhotosReady: () => {
    const photos = get().photos;
    return Object.values(photos).every((slot) => slot.status === 'ready');
  },

  generationStatus: 'idle',
  generationProgress: 0,
  modelUrl: null,
  setGenerationStatus: (status) => set({ generationStatus: status }),
  setGenerationProgress: (progress) => set({ generationProgress: progress }),
  setModelUrl: (url) => set({ modelUrl: url, generationStatus: 'ready', currentStep: 'viewer' }),

  toasts: [],
  addToast: (toast) => {
    const id = crypto.randomUUID();
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => get().removeToast(id), 4000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  apiKey: localStorage.getItem('autovision-api-key') || '',
  setApiKey: (key) => {
    localStorage.setItem('autovision-api-key', key);
    set({ apiKey: key });
  },
}));
