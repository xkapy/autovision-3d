import type * as THREE from 'three';

export type ThemeMode = 'day' | 'night';

export type PhotoAngle = 'front' | 'back' | 'left' | 'right';

export interface PhotoSlot {
  file: File | null;
  preview: string | null;
  status: 'empty' | 'uploading' | 'ready' | 'error';
}

export type PhotoCollection = Record<PhotoAngle, PhotoSlot>;

export type GenerationStatus =
  | 'idle'
  | 'uploading'
  | 'generating'
  | 'processing'
  | 'ready'
  | 'error';

export type AppStep = 'upload' | 'generate' | 'viewer' | 'export';

export interface Accessory {
  id: string;
  name: string;
  category: 'spoiler' | 'bodykit' | 'rims' | 'exhaust' | 'detail';
  enabled: boolean;
}

export interface LicensePlateConfig {
  text: string;
  color: string;
  backgroundColor: string;
}

export interface ModelModifications {
  paintColor: string;
  metalness: number;
  roughness: number;
  licensePlate: LicensePlateConfig;
  accessories: Accessory[];
  wireframe: boolean;
}

export interface ExportFormat {
  id: 'glb' | 'stl' | 'obj';
  name: string;
  description: string;
  extension: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export interface GenerationServiceConfig {
  provider: 'meshy' | 'tripo' | 'demo';
  apiKey?: string;
}

export interface GenerationResult {
  modelUrl: string;
  format: string;
  thumbnailUrl?: string;
}
