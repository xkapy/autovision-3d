import { create } from 'zustand';
import type { ModelModifications, Accessory } from '../types';

const defaultAccessories: Accessory[] = [
  { id: 'spoiler-1', name: 'Sport Spoiler', category: 'spoiler', enabled: false },
  { id: 'spoiler-2', name: 'GT Wing', category: 'spoiler', enabled: false },
  { id: 'bodykit-1', name: 'Front Lip', category: 'bodykit', enabled: false },
  { id: 'bodykit-2', name: 'Side Skirts', category: 'bodykit', enabled: false },
  { id: 'bodykit-3', name: 'Rear Diffuser', category: 'bodykit', enabled: false },
  { id: 'exhaust-1', name: 'Dual Exhaust', category: 'exhaust', enabled: false },
  { id: 'exhaust-2', name: 'Quad Tips', category: 'exhaust', enabled: false },
  { id: 'detail-1', name: 'Tinted Windows', category: 'detail', enabled: false },
  { id: 'detail-2', name: 'Carbon Mirror Caps', category: 'detail', enabled: false },
];

interface EditorState {
  modifications: ModelModifications;
  selectedCategory: string;
  setPaintColor: (color: string) => void;
  setMetalness: (value: number) => void;
  setRoughness: (value: number) => void;
  setLicensePlateText: (text: string) => void;
  setLicensePlateColor: (color: string) => void;
  setLicensePlateBg: (color: string) => void;
  toggleAccessory: (id: string) => void;
  setWireframe: (enabled: boolean) => void;
  setSelectedCategory: (category: string) => void;
  resetModifications: () => void;
}

const defaultModifications: ModelModifications = {
  paintColor: '#3B82F6',
  metalness: 0.6,
  roughness: 0.3,
  licensePlate: { text: 'AUTO 3D', color: '#1A1A2E', backgroundColor: '#FFFFFF' },
  accessories: defaultAccessories,
  wireframe: false,
};

export const useEditorStore = create<EditorState>((set) => ({
  modifications: { ...defaultModifications, accessories: defaultAccessories.map((a) => ({ ...a })) },
  selectedCategory: 'paint',
  setPaintColor: (color) =>
    set((s) => ({ modifications: { ...s.modifications, paintColor: color } })),
  setMetalness: (value) =>
    set((s) => ({ modifications: { ...s.modifications, metalness: value } })),
  setRoughness: (value) =>
    set((s) => ({ modifications: { ...s.modifications, roughness: value } })),
  setLicensePlateText: (text) =>
    set((s) => ({
      modifications: { ...s.modifications, licensePlate: { ...s.modifications.licensePlate, text } },
    })),
  setLicensePlateColor: (color) =>
    set((s) => ({
      modifications: { ...s.modifications, licensePlate: { ...s.modifications.licensePlate, color } },
    })),
  setLicensePlateBg: (color) =>
    set((s) => ({
      modifications: {
        ...s.modifications,
        licensePlate: { ...s.modifications.licensePlate, backgroundColor: color },
      },
    })),
  toggleAccessory: (id) =>
    set((s) => ({
      modifications: {
        ...s.modifications,
        accessories: s.modifications.accessories.map((a) =>
          a.id === id ? { ...a, enabled: !a.enabled } : a
        ),
      },
    })),
  setWireframe: (enabled) =>
    set((s) => ({ modifications: { ...s.modifications, wireframe: enabled } })),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  resetModifications: () =>
    set({ modifications: { ...defaultModifications, accessories: defaultAccessories.map((a) => ({ ...a })) } }),
}));
