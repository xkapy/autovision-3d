import type { PhotoCollection } from '../types';

export interface GenerationCallbacks {
  onProgress: (progress: number) => void;
  onStatusChange: (status: string) => void;
}

/**
 * Downloads a model file and returns a local blob URL.
 * Meshy CDN doesn't support CORS, so in dev we route through Vite's proxy.
 * The proxy is configured in vite.config.ts: /meshy-cdn/* → assets.meshy.ai/*
 */
async function downloadModelAsBlob(url: string): Promise<string> {
  // Rewrite the Meshy CDN URL to go through our Vite dev proxy
  // e.g. https://assets.meshy.ai/abc/model.glb → /meshy-cdn/abc/model.glb
  let fetchUrl = url;
  if (url.includes('assets.meshy.ai')) {
    const cdnPath = url.replace(/^https?:\/\/assets\.meshy\.ai/, '');
    fetchUrl = `/meshy-cdn${cdnPath}`;
  }

  const res = await fetch(fetchUrl);
  if (!res.ok) {
    throw new Error(`Failed to download model (HTTP ${res.status}). The model URL may have expired.`);
  }
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

/**
 * Meshy AI Image-to-3D service.
 * Requires API key from https://meshy.ai
 */
export async function generateWithMeshy(
  photos: PhotoCollection,
  apiKey: string,
  callbacks: GenerationCallbacks
): Promise<string> {
  callbacks.onStatusChange('Preparing upload...');
  callbacks.onProgress(5);

  // Use the front photo as the primary image for Meshy
  const frontPhoto = photos.front.file;
  if (!frontPhoto) throw new Error('Front photo is required');

  // Convert to base64 data URI
  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const imageDataUri = await toBase64(frontPhoto);
  callbacks.onProgress(15);
  callbacks.onStatusChange('Sending to Meshy AI...');

  // Create image-to-3d task
  const createRes = await fetch('https://api.meshy.ai/openapi/v1/image-to-3d', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_url: imageDataUri,
      enable_pbr: true,
      should_remesh: true,
      should_texture: true,
      ai_model: 'latest',
      topology: 'triangle',
      target_polycount: 50000,
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Meshy API error: ${createRes.status} - ${err}`);
  }

  const { result: taskId } = await createRes.json();
  callbacks.onProgress(25);
  callbacks.onStatusChange('Generating 3D model...');

  // Poll for completion
  let attempts = 0;
  const maxAttempts = 120; // ~2 minutes at 1s intervals

  while (attempts < maxAttempts) {
    await new Promise((r) => setTimeout(r, 2000));
    attempts++;

    const statusRes = await fetch(`https://api.meshy.ai/openapi/v1/image-to-3d/${taskId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!statusRes.ok) continue;

    const task = await statusRes.json();
    const progress = Math.min(25 + (task.progress || 0) * 0.7, 95);
    callbacks.onProgress(progress);

    if (task.status === 'SUCCEEDED') {
      callbacks.onProgress(95);
      callbacks.onStatusChange('Downloading model...');

      // Download the GLB through Meshy API to avoid CORS issues with their CDN
      const glbUrl = task.model_urls?.glb || task.model_urls?.obj;
      if (!glbUrl) throw new Error('No model URL returned');

      const blobUrl = await downloadModelAsBlob(glbUrl);
      callbacks.onProgress(100);
      callbacks.onStatusChange('Model ready!');
      return blobUrl;
    }

    if (task.status === 'FAILED') {
      throw new Error('Model generation failed on Meshy');
    }

    callbacks.onStatusChange(`Generating... ${task.progress || 0}%`);
  }

  throw new Error('Generation timed out');
}

/**
 * Demo mode — simulates generation with a timer and returns null (uses built-in demo model)
 */
export async function generateDemo(
  callbacks: GenerationCallbacks
): Promise<string | null> {
  const steps = [
    { progress: 10, status: 'Analyzing photos...', delay: 600 },
    { progress: 25, status: 'Detecting car geometry...', delay: 800 },
    { progress: 40, status: 'Building mesh structure...', delay: 700 },
    { progress: 55, status: 'Applying textures...', delay: 900 },
    { progress: 70, status: 'Optimizing topology...', delay: 600 },
    { progress: 85, status: 'Adding details...', delay: 500 },
    { progress: 95, status: 'Final polish...', delay: 400 },
    { progress: 100, status: 'Model ready!', delay: 300 },
  ];

  for (const step of steps) {
    await new Promise((r) => setTimeout(r, step.delay));
    callbacks.onProgress(step.progress);
    callbacks.onStatusChange(step.status);
  }

  // null = use the built-in procedural demo car
  return null;
}
