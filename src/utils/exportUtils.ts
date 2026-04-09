import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';

function getSceneFromCanvas(): THREE.Scene | null {
  const canvas = document.querySelector('canvas');
  if (!canvas) return null;
  // Access the R3F store via the canvas's __r3f property
  const store = (canvas as any).__r3f;
  if (!store) return null;
  return store.store?.getState()?.scene ?? store.scene ?? null;
}

function downloadBlob(blob: Blob, filename: string) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

function downloadString(text: string, filename: string) {
  const blob = new Blob([text], { type: 'text/plain' });
  downloadBlob(blob, filename);
}

async function exportGLB(scene: THREE.Scene) {
  const exporter = new GLTFExporter();
  const result = await exporter.parseAsync(scene, { binary: true });
  if (result instanceof ArrayBuffer) {
    downloadBlob(new Blob([result], { type: 'application/octet-stream' }), 'autovision-model.glb');
  }
}

function exportSTL(scene: THREE.Scene) {
  const exporter = new STLExporter();
  const result = exporter.parse(scene, { binary: true });
  if (result instanceof ArrayBuffer) {
    downloadBlob(new Blob([result], { type: 'application/octet-stream' }), 'autovision-model.stl');
  }
}

function exportOBJ(scene: THREE.Scene) {
  const exporter = new OBJExporter();
  const result = exporter.parse(scene);
  downloadString(result, 'autovision-model.obj');
}

export async function exportModel(format: 'glb' | 'stl' | 'obj') {
  const scene = getSceneFromCanvas();
  if (!scene) throw new Error('No 3D scene found');

  switch (format) {
    case 'glb':
      await exportGLB(scene);
      break;
    case 'stl':
      exportSTL(scene);
      break;
    case 'obj':
      exportOBJ(scene);
      break;
  }
}
