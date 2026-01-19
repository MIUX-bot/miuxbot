export interface Scene {
  title: string; // e.g., "Scene 1: The Hook"
  description: string; // Visual description of what's happening
  textOverlay: string; // New: Text to appear on screen
  narration: string;   // New: Voiceover script
  imageEditPrompt: string;
  videoGenPrompt: string;
}

export interface UGCConcept {
  title: string;
  strategy: string;
  scenes: Scene[]; 
}

export interface AnalysisResponse {
  concepts: UGCConcept[];
}

export interface UploadedImage {
  base64: string;
  mimeType: string;
  previewUrl: string;
}

export type GenerationMode = 'none' | 'manual' | 'merged';

export interface GenerationOptions {
  textOverlayMode: GenerationMode;
  narrationMode: GenerationMode;
  sceneCount: number; // Default 3, Min 1, Max 10
}